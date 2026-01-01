import { HttpError } from "wasp/server";
import type { GetLearningPath } from "wasp/server/operations";
import { LEARNING_PHASES, GOAL_PRIORITIES, getPhaseByPattern } from "../gamification/constants";

// ============== GET LEARNING PATH ==============
// Returns the learning path with progress for each phase and pattern
export const getLearningPath: GetLearningPath<void, any> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  // Get user data for personalization
  const user = await context.entities.User.findUnique({
    where: { id: context.user.id },
    select: {
      subscriptionStatus: true,
      onboardingGoal: true,
      experienceLevel: true,
    },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const isPremium = user.subscriptionStatus === "pro" || user.subscriptionStatus === "lifetime";

  // Get all patterns with problem counts
  const patterns = await context.entities.Pattern.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      order: true,
      isPremium: true,
      _count: {
        select: { problems: true },
      },
    },
    orderBy: { order: "asc" },
  });

  // Get user's solved problems per pattern
  const solvedProblems = await context.entities.UserProblemProgress.findMany({
    where: {
      userId: context.user.id,
      status: "solved",
    },
    select: {
      problem: {
        select: {
          patternId: true,
        },
      },
    },
  });

  // Count solved per pattern
  const solvedByPattern: Record<string, number> = {};
  for (const progress of solvedProblems) {
    const patternId = progress.problem?.patternId;
    if (patternId) {
      solvedByPattern[patternId] = (solvedByPattern[patternId] || 0) + 1;
    }
  }

  // Create pattern map by slug
  const patternMap = new Map(patterns.map(p => [p.slug, {
    ...p,
    totalProblems: p._count.problems,
    solvedProblems: solvedByPattern[p.id] || 0,
  }]));

  // Get priority patterns based on user's goal
  const goalPriority = user.onboardingGoal ? GOAL_PRIORITIES[user.onboardingGoal] : null;
  const priorityPatterns = new Set(goalPriority?.patterns || []);

  // Build phases with progress
  const phases = LEARNING_PHASES.map(phase => {
    const phasePatterns = phase.patterns.map(patternSlug => {
      const pattern = patternMap.get(patternSlug);
      if (!pattern) {
        return {
          slug: patternSlug,
          title: patternSlug,
          description: "",
          totalProblems: 0,
          solvedProblems: 0,
          progress: 0,
          isPremium: false,
          isLocked: false,
          isPriority: priorityPatterns.has(patternSlug),
        };
      }

      const progress = pattern.totalProblems > 0
        ? Math.round((pattern.solvedProblems / pattern.totalProblems) * 100)
        : 0;

      return {
        slug: pattern.slug,
        title: pattern.title,
        description: pattern.description,
        totalProblems: pattern.totalProblems,
        solvedProblems: pattern.solvedProblems,
        progress,
        isPremium: pattern.isPremium,
        isLocked: pattern.isPremium && !isPremium,
        isPriority: priorityPatterns.has(pattern.slug),
      };
    });

    // Calculate phase progress
    const totalProblems = phasePatterns.reduce((sum, p) => sum + p.totalProblems, 0);
    const solvedProblems = phasePatterns.reduce((sum, p) => sum + p.solvedProblems, 0);
    const phaseProgress = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    // Phase is locked if it's premium and user isn't
    const isLocked = phase.isPremium && !isPremium;

    return {
      ...phase,
      patterns: phasePatterns,
      totalProblems,
      solvedProblems,
      progress: phaseProgress,
      isLocked,
      isComplete: phaseProgress === 100,
    };
  });

  // Calculate overall progress
  const totalProblems = phases.reduce((sum, p) => sum + p.totalProblems, 0);
  const totalSolved = phases.reduce((sum, p) => sum + p.solvedProblems, 0);
  const overallProgress = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  // Find current phase (first incomplete, unlocked phase)
  const currentPhase = phases.find(p => !p.isLocked && p.progress < 100);

  // Find recommended next pattern
  let recommendedPattern: any = null;
  if (currentPhase) {
    // First try priority patterns
    const priorityPattern = currentPhase.patterns.find(p => p.isPriority && !p.isLocked && p.progress < 100);
    if (priorityPattern) {
      recommendedPattern = {
        slug: priorityPattern.slug,
        title: priorityPattern.title,
        phaseId: currentPhase.id,
        phaseName: currentPhase.name,
      };
    } else {
      // Fall back to first incomplete pattern
      const incompletePattern = currentPhase.patterns.find(p => !p.isLocked && p.progress < 100);
      if (incompletePattern) {
        recommendedPattern = {
          slug: incompletePattern.slug,
          title: incompletePattern.title,
          phaseId: currentPhase.id,
          phaseName: currentPhase.name,
        };
      }
    }
  }

  return {
    phases,
    overallProgress,
    totalProblems,
    totalSolved,
    currentPhaseId: currentPhase?.id || null,
    recommendedPattern,
    isPremium,
  };
};

// ============== TYPES ==============
interface PatternProgress {
  slug: string;
  title: string;
  description: string;
  totalProblems: number;
  solvedProblems: number;
  progress: number;
  isPremium: boolean;
  isLocked: boolean;
  isPriority: boolean;
}

interface PhaseProgress {
  id: number;
  name: string;
  description: string;
  icon: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  patterns: PatternProgress[];
  totalProblems: number;
  solvedProblems: number;
  progress: number;
  isPremium: boolean;
  isLocked: boolean;
  isComplete: boolean;
}

interface LearningPathData {
  phases: PhaseProgress[];
  overallProgress: number;
  totalProblems: number;
  totalSolved: number;
  currentPhaseId: number | null;
  recommendedPattern: {
    slug: string;
    title: string;
    phaseId: number;
    phaseName: string;
  } | null;
  isPremium: boolean;
}

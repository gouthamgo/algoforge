import { type AuthUser } from "wasp/auth";
import { HttpError } from "wasp/server";

// Context for getRoadmap - entities: [Topic, Pattern, Problem, UserProblemProgress]
type GetRoadmapContext = {
  user?: AuthUser;
  entities: {
    Topic: any;
    Pattern: any;
    Problem: any;
    UserProblemProgress: any;
  };
};

// Context for getTopic - entities: [Topic, Pattern, Problem, UserProblemProgress]
type GetTopicContext = {
  user?: AuthUser;
  entities: {
    Topic: any;
    Pattern: any;
    Problem: any;
    UserProblemProgress: any;
  };
};

// Context for getPattern - entities: [Pattern, Problem, UserProblemProgress]
type GetPatternContext = {
  user?: AuthUser;
  entities: {
    Pattern: any;
    Problem: any;
    UserProblemProgress: any;
  };
};

export const getRoadmap = async (_args: void, context: GetRoadmapContext) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Topic, UserProblemProgress } = context.entities;

  const topics = await Topic.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      patterns: {
        orderBy: { order: "asc" },
        include: {
          problems: {
            where: { isPublished: true },
            select: { id: true },
          },
        },
      },
    },
  });

  // Get user progress for all problems
  const userProgress = await UserProblemProgress.findMany({
    where: { userId: context.user.id },
    select: {
      problemId: true,
      status: true,
    },
  });

  const progressMap = new Map(userProgress.map((p: any) => [p.problemId, p.status]));

  // Calculate progress for each topic and pattern
  const topicsWithProgress = topics.map((topic: any) => {
    let topicSolved = 0;
    let topicTotal = 0;

    const patternsWithProgress = topic.patterns.map((pattern: any) => {
      const problemIds = pattern.problems.map((p: any) => p.id);
      const solved = problemIds.filter((id: string) => progressMap.get(id) === "solved").length;
      topicSolved += solved;
      topicTotal += problemIds.length;

      return {
        ...pattern,
        problemCount: problemIds.length,
        solvedCount: solved,
        progress: problemIds.length > 0 ? Math.round((solved / problemIds.length) * 100) : 0,
      };
    });

    return {
      ...topic,
      patterns: patternsWithProgress,
      totalProblems: topicTotal,
      solvedProblems: topicSolved,
      progress: topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0,
    };
  });

  return topicsWithProgress;
};

export const getTopic = async (
  args: { topicSlug: string },
  context: GetTopicContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Topic, UserProblemProgress } = context.entities;

  const topic = await Topic.findUnique({
    where: { slug: args.topicSlug },
    include: {
      patterns: {
        orderBy: { order: "asc" },
        include: {
          problems: {
            where: { isPublished: true },
            orderBy: { order: "asc" },
            select: {
              id: true,
              slug: true,
              title: true,
              difficulty: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!topic) {
    throw new HttpError(404, "Topic not found");
  }

  // Get user progress
  const userProgress = await UserProblemProgress.findMany({
    where: { userId: context.user.id },
    select: {
      problemId: true,
      status: true,
    },
  });

  const progressMap = new Map(userProgress.map((p: any) => [p.problemId, p.status]));

  const patternsWithProgress = topic.patterns.map((pattern: any) => {
    const problemsWithStatus = pattern.problems.map((problem: any) => ({
      ...problem,
      status: progressMap.get(problem.id) || "not_started",
    }));

    const solved = problemsWithStatus.filter((p: any) => p.status === "solved").length;

    return {
      ...pattern,
      problems: problemsWithStatus,
      solvedCount: solved,
      progress: pattern.problems.length > 0 ? Math.round((solved / pattern.problems.length) * 100) : 0,
    };
  });

  return {
    ...topic,
    patterns: patternsWithProgress,
  };
};

export const getPattern = async (
  args: { topicSlug: string; patternSlug: string },
  context: GetPatternContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Pattern, UserProblemProgress } = context.entities;

  const pattern = await Pattern.findUnique({
    where: { slug: args.patternSlug },
    include: {
      topic: {
        select: { title: true, slug: true },
      },
      problems: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: {
          companies: true,
        },
      },
    },
  });

  if (!pattern) {
    throw new HttpError(404, "Pattern not found");
  }

  // Get user progress
  const userProgress = await UserProblemProgress.findMany({
    where: { userId: context.user.id },
    select: {
      problemId: true,
      status: true,
      hintsUsed: true,
      solutionViewed: true,
    },
  });

  const progressMap = new Map(userProgress.map((p: any) => [p.problemId, p]));

  const problemsWithProgress = pattern.problems.map((problem: any) => {
    const progress = progressMap.get(problem.id) as any;
    return {
      ...problem,
      status: progress?.status || "not_started",
      hintsUsed: progress?.hintsUsed || 0,
      solutionViewed: progress?.solutionViewed || false,
    };
  });

  const solved = problemsWithProgress.filter((p: any) => p.status === "solved").length;

  return {
    ...pattern,
    problems: problemsWithProgress,
    solvedCount: solved,
    progress: pattern.problems.length > 0 ? Math.round((solved / pattern.problems.length) * 100) : 0,
  };
};

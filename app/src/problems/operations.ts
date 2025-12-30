import { type AuthUser } from "wasp/auth";
import { HttpError } from "wasp/server";

// Context types for different operations (entities must match main.wasp declarations)
type GetProblemsContext = {
  user?: AuthUser;
  entities: {
    Problem: any;
    UserProblemProgress: any;
    ProblemCompany: any;
  };
};

type GetProblemContext = {
  user?: AuthUser;
  entities: {
    Problem: any;
    UserProblemProgress: any;
    Submission: any;
  };
};

type SubmitCodeContext = {
  user?: AuthUser;
  entities: {
    Problem: any;
    Submission: any;
    UserProblemProgress: any;
    User: any;
    ReviewQueueItem: any;
  };
};

type SaveProgressContext = {
  user?: AuthUser;
  entities: {
    UserProblemProgress: any;
  };
};

type UseHintContext = {
  user?: AuthUser;
  entities: {
    Problem: any;
    UserProblemProgress: any;
  };
};

type ViewSolutionContext = {
  user?: AuthUser;
  entities: {
    Problem: any;
    UserProblemProgress: any;
  };
};

type RunCodeContext = {
  user?: AuthUser;
  entities: Record<string, any>;
};

export const getProblems = async (
  args: {
    difficulty?: string;
    pattern?: string;
    company?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  context: GetProblemsContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Problem, UserProblemProgress } = context.entities;
  const page = args.page || 1;
  const limit = args.limit || 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = { isPublished: true };

  if (args.difficulty) {
    where.difficulty = args.difficulty;
  }

  if (args.pattern) {
    where.pattern = { slug: args.pattern };
  }

  if (args.company) {
    where.companies = { some: { companyName: args.company } };
  }

  if (args.search) {
    where.OR = [
      { title: { contains: args.search, mode: "insensitive" } },
      { description: { contains: args.search, mode: "insensitive" } },
    ];
  }

  // Get problems
  const problems = await Problem.findMany({
    where,
    include: {
      pattern: { select: { title: true, slug: true } },
      companies: { select: { companyName: true, frequency: true } },
    },
    orderBy: [{ difficulty: "asc" }, { title: "asc" }],
    skip,
    take: limit,
  });

  // Get user progress
  const userProgress = await UserProblemProgress.findMany({
    where: { userId: context.user.id },
    select: { problemId: true, status: true },
  });

  const progressMap = new Map(userProgress.map((p: any) => [p.problemId, p.status]));

  // Filter by status if specified
  let filteredProblems = problems.map((problem: any) => ({
    ...problem,
    status: progressMap.get(problem.id) || "not_started",
  }));

  if (args.status) {
    filteredProblems = filteredProblems.filter((p: any) => p.status === args.status);
  }

  // Get total count
  const total = await Problem.count({ where });

  return {
    problems: filteredProblems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProblem = async (args: { slug: string }, context: GetProblemContext) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Problem, UserProblemProgress, Submission } = context.entities;

  const problem = await Problem.findUnique({
    where: { slug: args.slug },
    include: {
      pattern: { select: { title: true, slug: true, topic: { select: { title: true, slug: true } } } },
      companies: true,
    },
  });

  if (!problem) {
    throw new HttpError(404, "Problem not found");
  }

  // Get user progress
  const progress = await UserProblemProgress.findUnique({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: problem.id,
      },
    },
  });

  // Get recent submissions
  const submissions = await Submission.findMany({
    where: {
      userId: context.user.id,
      problemId: problem.id,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return {
    ...problem,
    userProgress: progress,
    submissions,
  };
};

export const runCode = async (
  args: {
    code: string;
    language: string;
    input?: string;
  },
  _context: RunCodeContext
) => {
  // TODO: Integrate with Judge0 or Piston API
  // For now, return a mock response
  return {
    status: "success",
    output: "Code execution not yet implemented",
    runtime: 0,
    memory: 0,
  };
};

export const submitCode = async (
  args: {
    problemId: string;
    code: string;
    language: string;
  },
  context: SubmitCodeContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Problem, Submission, UserProblemProgress, User, ReviewQueueItem } = context.entities;

  const problem = await Problem.findUnique({ where: { id: args.problemId } });
  if (!problem) {
    throw new HttpError(404, "Problem not found");
  }

  // Create submission
  const submission = await Submission.create({
    data: {
      userId: context.user.id,
      problemId: args.problemId,
      code: args.code,
      language: args.language,
      status: "pending",
    },
  });

  // TODO: Run tests against Judge0/Piston and update submission status
  // For now, mark as accepted for demo purposes
  await Submission.update({
    where: { id: submission.id },
    data: {
      status: "accepted",
      runtime: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 10000),
    },
  });

  // Update user progress
  await UserProblemProgress.upsert({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
    create: {
      userId: context.user.id,
      problemId: args.problemId,
      status: "solved",
      solvedAt: new Date(),
      bestCode: args.code,
      bestLanguage: args.language,
      attemptCount: 1,
    },
    update: {
      status: "solved",
      solvedAt: new Date(),
      bestCode: args.code,
      bestLanguage: args.language,
      attemptCount: { increment: 1 },
    },
  });

  // Award XP
  const xpReward = problem.xpReward || 10;
  await User.update({
    where: { id: context.user.id },
    data: {
      totalXp: { increment: xpReward },
      lastActiveDate: new Date(),
    },
  });

  // Add to review queue (for spaced repetition)
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 1);

  await ReviewQueueItem.upsert({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
    create: {
      userId: context.user.id,
      problemId: args.problemId,
      dueDate: nextReviewDate,
    },
    update: {
      dueDate: nextReviewDate,
    },
  });

  return {
    success: true,
    xpEarned: xpReward,
  };
};

export const saveProgress = async (
  args: {
    problemId: string;
    code: string;
    language: string;
    timeSpent?: number;
  },
  context: SaveProgressContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { UserProblemProgress } = context.entities;

  await UserProblemProgress.upsert({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
    create: {
      userId: context.user.id,
      problemId: args.problemId,
      status: "attempted",
      bestCode: args.code,
      bestLanguage: args.language,
      totalTimeSpent: args.timeSpent || 0,
      firstAttemptAt: new Date(),
    },
    update: {
      bestCode: args.code,
      bestLanguage: args.language,
      totalTimeSpent: args.timeSpent ? { increment: args.timeSpent } : undefined,
      lastAttemptAt: new Date(),
    },
  });

  return { success: true };
};

export const useHint = async (args: { problemId: string }, context: UseHintContext) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Problem, UserProblemProgress } = context.entities;

  const problem = await Problem.findUnique({ where: { id: args.problemId } });
  if (!problem) {
    throw new HttpError(404, "Problem not found");
  }

  const hints = JSON.parse(problem.hints || "[]");

  // Update progress
  const progress = await UserProblemProgress.upsert({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
    create: {
      userId: context.user.id,
      problemId: args.problemId,
      hintsUsed: 1,
    },
    update: {
      hintsUsed: { increment: 1 },
    },
  });

  const hintIndex = Math.min(progress.hintsUsed - 1, hints.length - 1);

  return {
    hint: hints[hintIndex] || "No more hints available",
    hintsRemaining: Math.max(0, hints.length - progress.hintsUsed),
    totalHints: hints.length,
  };
};

export const viewSolution = async (args: { problemId: string }, context: ViewSolutionContext) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { Problem, UserProblemProgress } = context.entities;

  const problem = await Problem.findUnique({ where: { id: args.problemId } });
  if (!problem) {
    throw new HttpError(404, "Problem not found");
  }

  // Mark solution as viewed
  await UserProblemProgress.upsert({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
    create: {
      userId: context.user.id,
      problemId: args.problemId,
      solutionViewed: true,
    },
    update: {
      solutionViewed: true,
    },
  });

  return {
    solutions: JSON.parse(problem.solutions || "[]"),
  };
};

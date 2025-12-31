import { type AuthUser } from "wasp/auth";
import { HttpError } from "wasp/server";

type GetDashboardDataContext = {
  user?: AuthUser;
  entities: {
    User: any;
    UserProblemProgress: any;
    StudySession: any;
    ReviewQueueItem: any;
    Problem: any;
    Pattern: any;
  };
};

export const getDashboardData = async (
  _args: void,
  context: GetDashboardDataContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { User, UserProblemProgress, ReviewQueueItem, Problem, Pattern } = context.entities;

  // Get user with stats
  const user = await User.findUnique({
    where: { id: context.user.id },
    select: {
      id: true,
      displayName: true,
      username: true,
      email: true,
      currentStreak: true,
      longestStreak: true,
      totalXp: true,
      level: true,
      dailyGoal: true,
      preferredLanguage: true,
    },
  });

  // Get problem progress stats
  const progressStats = await UserProblemProgress.groupBy({
    by: ["status"],
    where: { userId: context.user.id },
    _count: { status: true },
  });

  const solvedCount = progressStats.find((s: any) => s.status === "solved")?._count?.status || 0;
  const attemptedCount = progressStats.find((s: any) => s.status === "attempted")?._count?.status || 0;

  // Get problems solved today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const solvedToday = await UserProblemProgress.count({
    where: {
      userId: context.user.id,
      solvedAt: { gte: today },
    },
  });

  // Get review queue count
  const reviewsDue = await ReviewQueueItem.count({
    where: {
      userId: context.user.id,
      dueDate: { lte: new Date() },
    },
  });

  // Get recent activity (last 7 days of solved problems)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentActivity = await UserProblemProgress.findMany({
    where: {
      userId: context.user.id,
      solvedAt: { gte: sevenDaysAgo },
    },
    include: {
      problem: {
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
        },
      },
    },
    orderBy: { solvedAt: "desc" },
    take: 10,
  });

  // Get next recommended problems - ordered by learning sequence
  const nextProblems = await Problem.findMany({
    where: {
      isPublished: true,
      NOT: {
        progress: {
          some: {
            userId: context.user.id,
            status: "solved",
          },
        },
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      difficulty: true,
      order: true,
      pattern: {
        select: {
          title: true,
          slug: true,
          order: true,
        },
      },
    },
    orderBy: [
      { pattern: { order: "asc" } },
      { order: "asc" },
    ],
    take: 5,
  });

  // Get pattern progress
  const patterns = await Pattern.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      order: true,
      problems: {
        where: { isPublished: true },
        select: { id: true },
      },
    },
  });

  // Get solved problem IDs for this user
  const solvedProblems = await UserProblemProgress.findMany({
    where: {
      userId: context.user.id,
      status: "solved",
    },
    select: { problemId: true },
  });

  const solvedProblemIds = new Set(solvedProblems.map((p: any) => p.problemId));

  // Calculate progress for each pattern
  const patternProgress = patterns.map((pattern: any) => {
    const problemIds = pattern.problems.map((p: any) => p.id);
    const solved = problemIds.filter((id: string) => solvedProblemIds.has(id)).length;
    return {
      slug: pattern.slug,
      title: pattern.title,
      order: pattern.order,
      solved,
      total: problemIds.length,
    };
  });

  return {
    user,
    stats: {
      totalSolved: solvedCount,
      totalAttempted: attemptedCount,
      solvedToday,
      streak: user?.currentStreak || 0,
      reviewsDue,
      dailyGoal: user?.dailyGoal || 3,
    },
    recentActivity,
    nextProblems,
    patternProgress,
  };
};

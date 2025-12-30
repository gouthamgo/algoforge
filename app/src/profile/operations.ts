import { type AuthUser } from "wasp/auth";
import { HttpError } from "wasp/server";

// Context for getUserProfile - entities: [User, UserProblemProgress, UserAchievement, Achievement]
type GetUserProfileContext = {
  user?: AuthUser;
  entities: {
    User: any;
    UserProblemProgress: any;
    UserAchievement: any;
    Achievement: any;
  };
};

// Context for updateSettings - entities: [User]
type UpdateSettingsContext = {
  user?: AuthUser;
  entities: {
    User: any;
  };
};

export const getUserProfile = async (_args: void, context: GetUserProfileContext) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { User, UserProblemProgress, UserAchievement } = context.entities;

  const user = await User.findUnique({
    where: { id: context.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      currentStreak: true,
      longestStreak: true,
      totalXp: true,
      level: true,
      preferredLanguage: true,
      dailyGoal: true,
      createdAt: true,
    },
  });

  // Get problem stats
  const progressStats = await UserProblemProgress.groupBy({
    by: ["status"],
    where: { userId: context.user.id },
    _count: { status: true },
  });

  const difficultyStats = await UserProblemProgress.groupBy({
    by: ["status"],
    where: {
      userId: context.user.id,
      status: "solved",
    },
    _count: true,
  });

  // Get achievements
  const achievements = await UserAchievement.findMany({
    where: { userId: context.user.id },
    include: {
      achievement: true,
    },
    orderBy: { unlockedAt: "desc" },
  });

  // Calculate stats
  const stats = {
    solved: progressStats.find((s: any) => s.status === "solved")?._count?.status || 0,
    attempted: progressStats.find((s: any) => s.status === "attempted")?._count?.status || 0,
    totalProblems: progressStats.reduce((sum: number, s: any) => sum + (s._count?.status || 0), 0),
  };

  return {
    user,
    stats,
    achievements: achievements.map((ua: any) => ua.achievement),
  };
};

export const updateSettings = async (
  args: {
    displayName?: string;
    username?: string;
    preferredLanguage?: string;
    dailyGoal?: number;
  },
  context: UpdateSettingsContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { User } = context.entities;

  // Check username uniqueness if changing
  if (args.username) {
    const existing = await User.findFirst({
      where: {
        username: args.username,
        NOT: { id: context.user.id },
      },
    });

    if (existing) {
      throw new HttpError(400, "Username already taken");
    }
  }

  const updated = await User.update({
    where: { id: context.user.id },
    data: {
      displayName: args.displayName,
      username: args.username,
      preferredLanguage: args.preferredLanguage,
      dailyGoal: args.dailyGoal,
    },
  });

  return updated;
};

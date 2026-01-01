import { HttpError } from "wasp/server";
import type {
  GetGamificationData,
  GetHeaderStats,
} from "wasp/server/operations";
import { calculateLevelFromXp, getLevelTitle, LEARNING_PHASES, ACHIEVEMENT_CATEGORIES } from "./constants";

// ============== GET GAMIFICATION DATA ==============
// Returns comprehensive gamification data for the dashboard
export const getGamificationData: GetGamificationData<void, any> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id },
    select: {
      totalXp: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
      lastActiveDate: true,
      dailyGoal: true,
      problemsSolvedToday: true,
      lastDailyReset: true,
    },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  // Get user achievements with details
  const userAchievements = await context.entities.UserAchievement.findMany({
    where: { userId: context.user.id },
    include: {
      achievement: true,
    },
    orderBy: { unlockedAt: "desc" },
  });

  // Get all achievements for "next up" display
  const allAchievements = await context.entities.Achievement.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  // Get problem progress for pattern completion tracking
  const problemProgress = await context.entities.UserProblemProgress.findMany({
    where: {
      userId: context.user.id,
      status: "solved",
    },
    select: {
      problem: {
        select: {
          pattern: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  // Calculate level info
  const levelInfo = calculateLevelFromXp(user.totalXp);
  const levelTitle = getLevelTitle(levelInfo.level);

  // Calculate XP progress percentage
  const xpProgress = Math.round((levelInfo.currentXp / levelInfo.xpForNextLevel) * 100);

  // Calculate daily goal progress
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastReset = user.lastDailyReset ? new Date(user.lastDailyReset) : null;
  const needsReset = !lastReset || lastReset < today;
  const solvedToday = needsReset ? 0 : user.problemsSolvedToday;
  const dailyGoalProgress = Math.min(Math.round((solvedToday / user.dailyGoal) * 100), 100);

  // Calculate pattern progress for each phase
  const patternSolvedCounts: Record<string, number> = {};
  for (const progress of problemProgress) {
    const patternSlug = progress.problem?.pattern?.slug;
    if (patternSlug) {
      patternSolvedCounts[patternSlug] = (patternSolvedCounts[patternSlug] || 0) + 1;
    }
  }

  // Map achievements by ID for quick lookup
  const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievementId));

  // Group achievements by category
  const achievementsByCategory: Record<string, Achievement[]> = {};
  const nextAchievements: Achievement[] = [];

  for (const achievement of allAchievements) {
    const isUnlocked = unlockedAchievementIds.has(achievement.id);
    const achievementData = {
      ...achievement,
      isUnlocked,
      unlockedAt: userAchievements.find(ua => ua.achievementId === achievement.id)?.unlockedAt,
    };

    // Group by category
    if (!achievementsByCategory[achievement.category]) {
      achievementsByCategory[achievement.category] = [];
    }
    achievementsByCategory[achievement.category].push(achievementData);

    // Track next achievements (first locked in each category)
    if (!isUnlocked && nextAchievements.length < 3) {
      const categoryNexts = nextAchievements.filter(a => a.category === achievement.category);
      if (categoryNexts.length === 0) {
        nextAchievements.push(achievementData);
      }
    }
  }

  return {
    user: {
      totalXp: user.totalXp,
      level: levelInfo.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      dailyGoal: user.dailyGoal,
      solvedToday,
    },
    levelInfo: {
      level: levelInfo.level,
      currentXp: levelInfo.currentXp,
      xpForNextLevel: levelInfo.xpForNextLevel,
      xpProgress,
      title: levelTitle.title,
      emoji: levelTitle.emoji,
      description: levelTitle.description,
    },
    dailyGoal: {
      target: user.dailyGoal,
      completed: solvedToday,
      progress: dailyGoalProgress,
      isComplete: solvedToday >= user.dailyGoal,
    },
    streak: {
      current: user.currentStreak,
      longest: user.longestStreak,
      lastActiveDate: user.lastActiveDate,
    },
    achievements: {
      unlocked: userAchievements.map(ua => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt,
      })),
      byCategory: achievementsByCategory,
      nextUp: nextAchievements,
      totalUnlocked: userAchievements.length,
      totalAvailable: allAchievements.length,
    },
    patternProgress: patternSolvedCounts,
  };
};

// ============== GET HEADER STATS ==============
// Returns minimal stats for the navbar header
export const getHeaderStats: GetHeaderStats<void, any> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id },
    select: {
      totalXp: true,
      level: true,
      currentStreak: true,
    },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const levelInfo = calculateLevelFromXp(user.totalXp);
  const levelTitle = getLevelTitle(levelInfo.level);

  return {
    level: levelInfo.level,
    levelEmoji: levelTitle.emoji,
    levelTitle: levelTitle.title,
    totalXp: user.totalXp,
    xpProgress: Math.round((levelInfo.currentXp / levelInfo.xpForNextLevel) * 100),
    currentStreak: user.currentStreak,
  };
};

// ============== TYPES ==============
interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  iconEmoji: string | null;
  xpReward: number;
  category: string;
  rarity: string;
  isUnlocked?: boolean;
  unlockedAt?: Date;
}

interface GamificationData {
  user: {
    totalXp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    dailyGoal: number;
    solvedToday: number;
  };
  levelInfo: {
    level: number;
    currentXp: number;
    xpForNextLevel: number;
    xpProgress: number;
    title: string;
    emoji: string;
    description: string;
  };
  dailyGoal: {
    target: number;
    completed: number;
    progress: number;
    isComplete: boolean;
  };
  streak: {
    current: number;
    longest: number;
    lastActiveDate: Date | null;
  };
  achievements: {
    unlocked: Achievement[];
    byCategory: Record<string, Achievement[]>;
    nextUp: Achievement[];
    totalUnlocked: number;
    totalAvailable: number;
  };
  patternProgress: Record<string, number>;
}

interface HeaderStats {
  level: number;
  levelEmoji: string;
  levelTitle: string;
  totalXp: number;
  xpProgress: number;
  currentStreak: number;
}

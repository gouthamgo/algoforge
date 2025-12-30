// Streak update job
// Runs daily at midnight to update streaks

type Context = {
  entities: {
    User: any;
  };
};

const STREAK_FREEZE_DAYS = 2;

export const updateStreaks = async (_args: unknown, context: Context) => {
  const { User } = context.entities;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const freezeThreshold = new Date(today);
  freezeThreshold.setDate(freezeThreshold.getDate() - STREAK_FREEZE_DAYS - 1);

  // Get all users with active streaks
  const users = await User.findMany({
    where: {
      currentStreak: { gt: 0 },
    },
    select: {
      id: true,
      currentStreak: true,
      longestStreak: true,
      lastActiveDate: true,
    },
  });

  let streaksReset = 0;
  let streaksMaintained = 0;

  for (const user of users) {
    if (!user.lastActiveDate) {
      // No last active date, reset streak
      await User.update({
        where: { id: user.id },
        data: { currentStreak: 0 },
      });
      streaksReset++;
      continue;
    }

    const lastActive = new Date(user.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    // Check if user was active yesterday or within freeze period
    if (lastActive >= yesterday) {
      // Active recently, streak maintained
      streaksMaintained++;
    } else if (lastActive >= freezeThreshold) {
      // Within freeze period, streak maintained but warned
      streaksMaintained++;
    } else {
      // Streak broken
      await User.update({
        where: { id: user.id },
        data: { currentStreak: 0 },
      });
      streaksReset++;
    }
  }

  console.log(`Streak update completed: ${streaksMaintained} maintained, ${streaksReset} reset`);
};

// Achievement checking job
// Runs every 15 minutes to check and award achievements

type Context = {
  entities: {
    User: any;
    UserAchievement: any;
    Achievement: any;
    UserProblemProgress: any;
  };
};

export const checkAchievements = async (_args: unknown, context: Context) => {
  const { User, UserAchievement, Achievement, UserProblemProgress } = context.entities;

  // Get all achievements
  const achievements = await Achievement.findMany();

  // Get all users
  const users = await User.findMany({
    select: { id: true },
  });

  for (const user of users) {
    // Get user stats
    const solvedCount = await UserProblemProgress.count({
      where: { userId: user.id, status: "solved" },
    });

    const userData = await User.findUnique({
      where: { id: user.id },
      select: { currentStreak: true, longestStreak: true },
    });

    // Get already earned achievements
    const earnedAchievements = await UserAchievement.findMany({
      where: { userId: user.id },
      select: { achievementId: true },
    });

    const earnedIds = new Set(earnedAchievements.map((ea: any) => ea.achievementId));

    // Check each achievement
    for (const achievement of achievements) {
      if (earnedIds.has(achievement.id)) continue;

      let earned = false;

      try {
        const criteria = JSON.parse(achievement.criteria);

        switch (criteria.type) {
          case "problemsSolved":
            earned = solvedCount >= criteria.count;
            break;

          case "streak":
            earned = (userData?.currentStreak || 0) >= criteria.count ||
                     (userData?.longestStreak || 0) >= criteria.count;
            break;

          case "hardProblemsSolved":
            const hardCount = await UserProblemProgress.count({
              where: {
                userId: user.id,
                status: "solved",
                problem: { difficulty: "hard" },
              },
            });
            earned = hardCount >= criteria.count;
            break;

          // Add more achievement types as needed
        }
      } catch (err) {
        console.error(`Error checking achievement ${achievement.slug}:`, err);
        continue;
      }

      if (earned) {
        // Award achievement
        await UserAchievement.create({
          data: {
            userId: user.id,
            achievementId: achievement.id,
          },
        });

        // Award XP
        await User.update({
          where: { id: user.id },
          data: {
            totalXp: { increment: achievement.xpReward },
          },
        });

        console.log(`User ${user.id} earned achievement: ${achievement.title}`);
      }
    }
  }

  console.log("Achievement check completed");
};

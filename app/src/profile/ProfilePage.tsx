import { useQuery } from "wasp/client/operations";
import { getUserProfile } from "wasp/client/operations";
import { Link } from "react-router-dom";
import { Trophy, Flame, Target, Zap, Calendar, Code2, Settings } from "lucide-react";
import { LEVEL_CONFIG } from "../shared/constants";

export default function ProfilePage() {
  const { data, isLoading, error } = useQuery(getUserProfile);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Error loading profile</p>
      </div>
    );
  }

  const { user, stats, achievements } = data || {};
  const levelTitle = Object.entries(LEVEL_CONFIG.titles)
    .reverse()
    .find(([lvl]) => (user?.level || 1) >= parseInt(lvl))?.[1] || "Novice";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || user.username}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {(user?.displayName || user?.username || "U")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {user?.displayName || user?.username || "Anonymous"}
                </h1>
                {user?.username && (
                  <p className="text-muted-foreground">@{user.username}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Level {user?.level || 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{levelTitle}</span>
                </div>
              </div>
            </div>
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">XP Progress</span>
              <span className="text-foreground font-medium">
                {user?.totalXp?.toLocaleString() || 0} XP
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((user?.totalXp || 0) % LEVEL_CONFIG.xpForLevel(user?.level || 1)) /
                      LEVEL_CONFIG.xpForLevel(user?.level || 1) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Solved</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.solved || 0}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Flame className="h-4 w-4" />
              <span className="text-sm">Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{user?.currentStreak || 0}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Total XP</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(user?.totalXp || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm">Daily Goal</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{user?.dailyGoal || 3}</p>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Achievements</h2>
            <Link
              to="/achievements"
              className="text-sm text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>

          {achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.slice(0, 4).map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No achievements yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Solve problems to earn achievements
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

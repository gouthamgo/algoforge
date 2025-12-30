import { useQuery } from "wasp/client/operations";
import { getUserProfile } from "wasp/client/operations";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Lock, Sparkles } from "lucide-react";

const RARITY_STYLES = {
  common: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
  rare: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  epic: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  legendary: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

export default function AchievementsPage() {
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
        <p className="text-destructive">Error loading achievements</p>
      </div>
    );
  }

  const { achievements } = data || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Achievements
          </h1>
          <p className="text-muted-foreground mt-1">
            {achievements?.length || 0} achievements unlocked
          </p>
        </div>

        {/* Achievements Grid */}
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement: any) => {
              const rarityStyle = RARITY_STYLES[achievement.rarity as keyof typeof RARITY_STYLES] || RARITY_STYLES.common;

              return (
                <div
                  key={achievement.id}
                  className={`bg-card border rounded-xl p-6 ${rarityStyle.split(" ").slice(0, 2).join(" ")}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          {achievement.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${rarityStyle}`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-primary font-medium">
                          +{achievement.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No achievements yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start solving problems to unlock achievements!
            </p>
            <Link
              to="/problems"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Solving
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

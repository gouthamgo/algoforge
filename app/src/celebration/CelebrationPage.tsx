import { useParams, Link } from "react-router-dom";
import { useQuery } from "wasp/client/operations";
import { getCelebration } from "wasp/client/operations";
import { Trophy, Flame, TrendingUp, Target, Star, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { ShareButtons } from "./components/ShareButtons";

// Map celebration types to icons
const typeIcons: Record<string, React.ComponentType<any>> = {
  achievement: Trophy,
  level_up: TrendingUp,
  streak_milestone: Flame,
  daily_goal: Target,
  pattern_complete: Star,
  first_solve: CheckCircle2,
};

// Map celebration types to colors
const typeColors: Record<string, { gradient: string; glow: string }> = {
  achievement: { gradient: "from-violet-500 to-fuchsia-500", glow: "shadow-violet-500/30" },
  level_up: { gradient: "from-amber-500 to-orange-500", glow: "shadow-amber-500/30" },
  streak_milestone: { gradient: "from-orange-500 to-red-500", glow: "shadow-orange-500/30" },
  daily_goal: { gradient: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30" },
  pattern_complete: { gradient: "from-cyan-500 to-blue-500", glow: "shadow-cyan-500/30" },
  first_solve: { gradient: "from-pink-500 to-rose-500", glow: "shadow-pink-500/30" },
};

export default function CelebrationPage() {
  const { celebrationId } = useParams<{ celebrationId: string }>();
  const { data: celebration, isLoading, error } = useQuery(getCelebration, {
    celebrationId: celebrationId || "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-2xl opacity-50 animate-pulse" />
          </div>
          <p className="text-zinc-400 text-sm">Loading celebration...</p>
        </div>
      </div>
    );
  }

  if (error || !celebration) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-zinc-600" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Celebration Not Found</h1>
          <p className="text-zinc-500 mb-6">This celebration may have expired or doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
          >
            Go to AlgoForge
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const Icon = typeIcons[celebration.type] || Trophy;
  const colors = typeColors[celebration.type] || typeColors.achievement;
  const shareUrl = window.location.href;

  // Get share text
  const getShareText = () => {
    switch (celebration.type) {
      case "achievement":
        return `${celebration.user.displayName || celebration.user.username || "Someone"} unlocked "${celebration.achievement?.title}" on AlgoForge!`;
      case "level_up":
        return `${celebration.user.displayName || celebration.user.username || "Someone"} reached Level ${celebration.referenceId} on AlgoForge!`;
      case "streak_milestone":
        return `${celebration.referenceId}-day coding streak on AlgoForge!`;
      default:
        return `Check out this achievement on AlgoForge!`;
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Main card */}
        <div className="w-full max-w-lg">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden">
            {/* Header gradient */}
            <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

            <div className="p-8">
              {/* User info */}
              <div className="flex items-center gap-3 mb-8">
                {celebration.user.avatarUrl ? (
                  <img
                    src={celebration.user.avatarUrl}
                    alt=""
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                    {(celebration.user.displayName || celebration.user.username || "A")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">
                    {celebration.user.displayName || celebration.user.username || "AlgoForge User"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {celebration.user.levelInfo.emoji} Level {celebration.user.level} - {celebration.user.levelInfo.title}
                  </p>
                </div>
              </div>

              {/* Celebration icon */}
              <div className="flex justify-center mb-6">
                <div
                  className={`
                    h-24 w-24 rounded-3xl flex items-center justify-center
                    bg-gradient-to-br ${colors.gradient}
                    shadow-2xl ${colors.glow}
                  `}
                >
                  {celebration.achievement?.iconEmoji ? (
                    <span className="text-5xl">{celebration.achievement.iconEmoji}</span>
                  ) : (
                    <Icon className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>

              {/* Message */}
              <h1 className="text-2xl font-bold text-center text-white mb-2">
                {celebration.message}
              </h1>

              {/* Achievement details */}
              {celebration.achievement && (
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-violet-400 mb-1">
                    {celebration.achievement.title}
                  </h2>
                  <p className="text-zinc-400">{celebration.achievement.description}</p>
                  <span
                    className={`
                      inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold uppercase
                      bg-gradient-to-r ${colors.gradient} text-white
                    `}
                  >
                    {celebration.achievement.rarity}
                  </span>
                </div>
              )}

              {/* XP earned */}
              {celebration.xpAwarded > 0 && (
                <div className="flex items-center justify-center gap-2 mb-8 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <span className="text-2xl font-bold text-violet-400">+{celebration.xpAwarded}</span>
                  <span className="text-violet-400">XP</span>
                </div>
              )}

              {/* Share buttons */}
              <ShareButtons shareUrl={shareUrl} shareText={getShareText()} />

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-zinc-500 text-sm mb-4">
                  Want to achieve this too?
                </p>
                <Link
                  to="/signup"
                  className={`
                    inline-flex items-center gap-2 px-8 py-3 rounded-xl
                    bg-gradient-to-r ${colors.gradient}
                    text-white font-semibold
                    shadow-lg ${colors.glow}
                    hover:opacity-90 transition-opacity
                  `}
                >
                  Join AlgoForge
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              AlgoForge - Master Coding Interviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

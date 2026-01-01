import { useEffect, useState } from "react";
import { X, Trophy, Flame, TrendingUp, Target, Star, CheckCircle2 } from "lucide-react";
import { Confetti } from "./Confetti";
import { XPReveal } from "./XPReveal";
import { ShareButtons } from "./ShareButtons";
import { CELEBRATION_MESSAGES, getLevelTitle } from "../../gamification/constants";

interface CelebrationData {
  id: string;
  type: string;
  referenceId: string | null;
  xpAwarded: number;
  message: string;
  achievement?: {
    title: string;
    description: string;
    iconName: string;
    iconEmoji: string | null;
    rarity: string;
    xpReward: number;
  } | null;
  levelInfo?: {
    title: string;
    emoji: string;
    description: string;
  } | null;
}

interface CelebrationModalProps {
  celebration: CelebrationData | null;
  isOpen: boolean;
  onClose: () => void;
  onShare?: (platform: string) => void;
  shareUrl?: string;
}

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
const typeColors: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  achievement: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  level_up: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    gradient: "from-amber-500 to-orange-500",
  },
  streak_milestone: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
  },
  daily_goal: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
  },
  pattern_complete: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    gradient: "from-cyan-500 to-blue-500",
  },
  first_solve: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    gradient: "from-pink-500 to-rose-500",
  },
};

export function CelebrationModal({
  celebration,
  isOpen,
  onClose,
  onShare,
  shareUrl,
}: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<"enter" | "xp" | "share">("enter");

  useEffect(() => {
    if (isOpen && celebration) {
      setShowConfetti(true);
      setPhase("enter");

      // Progress through phases
      const xpTimer = setTimeout(() => setPhase("xp"), 500);
      const shareTimer = setTimeout(() => setPhase("share"), 3500);

      return () => {
        clearTimeout(xpTimer);
        clearTimeout(shareTimer);
      };
    } else {
      setShowConfetti(false);
      setPhase("enter");
    }
  }, [isOpen, celebration]);

  if (!isOpen || !celebration) return null;

  const Icon = typeIcons[celebration.type] || Trophy;
  const colors = typeColors[celebration.type] || typeColors.achievement;
  const defaultShareUrl = shareUrl || `${window.location.origin}/celebrate/${celebration.id}`;

  // Get share text based on celebration type
  const getShareText = () => {
    switch (celebration.type) {
      case "achievement":
        return `I just unlocked "${celebration.achievement?.title}" on AlgoForge! 🎯`;
      case "level_up":
        return `I just reached Level ${celebration.referenceId} (${celebration.levelInfo?.title}) on AlgoForge! 🚀`;
      case "streak_milestone":
        return `${celebration.referenceId}-day streak on AlgoForge! 🔥`;
      case "daily_goal":
        return `I completed my daily coding goal on AlgoForge! ✅`;
      case "pattern_complete":
        return `I mastered a new pattern on AlgoForge! 🧠`;
      default:
        return `Check out my achievement on AlgoForge!`;
    }
  };

  return (
    <>
      {/* Confetti */}
      <Confetti isActive={showConfetti} duration={4000} />

      {/* Modal backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        {/* Modal content */}
        <div
          className="relative w-full max-w-md bg-[#0a0a12] rounded-3xl border border-white/10 overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10`}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>

          {/* Content */}
          <div className="relative p-8">
            {/* Icon */}
            <div
              className={`
                mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6
                bg-gradient-to-br ${colors.gradient} shadow-2xl
                animate-bounce-in
              `}
            >
              {celebration.achievement?.iconEmoji ? (
                <span className="text-4xl">{celebration.achievement.iconEmoji}</span>
              ) : celebration.levelInfo?.emoji ? (
                <span className="text-4xl">{celebration.levelInfo.emoji}</span>
              ) : (
                <Icon className="h-10 w-10 text-white" />
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-white mb-2 animate-fade-up">
              {celebration.message}
            </h2>

            {/* Achievement/Level specific content */}
            {celebration.achievement && (
              <div className="text-center mb-6 animate-fade-up delay-100">
                <h3 className={`text-xl font-semibold ${colors.text} mb-1`}>
                  {celebration.achievement.title}
                </h3>
                <p className="text-zinc-400 text-sm">
                  {celebration.achievement.description}
                </p>
                {celebration.achievement.rarity && (
                  <span
                    className={`
                      inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase
                      ${colors.bg} ${colors.border} ${colors.text}
                    `}
                  >
                    {celebration.achievement.rarity}
                  </span>
                )}
              </div>
            )}

            {celebration.levelInfo && celebration.type === "level_up" && (
              <div className="text-center mb-6 animate-fade-up delay-100">
                <h3 className={`text-xl font-semibold ${colors.text} mb-1`}>
                  Level {celebration.referenceId}: {celebration.levelInfo.title}
                </h3>
                <p className="text-zinc-400 text-sm">
                  {celebration.levelInfo.description}
                </p>
              </div>
            )}

            {/* XP Reveal */}
            {phase !== "enter" && celebration.xpAwarded > 0 && (
              <div className="mb-6">
                <XPReveal
                  xpAmount={celebration.xpAwarded}
                  autoStart={phase === "xp" || phase === "share"}
                />
              </div>
            )}

            {/* Share buttons */}
            {phase === "share" && (
              <div className="animate-fade-up">
                <ShareButtons
                  shareUrl={defaultShareUrl}
                  shareText={getShareText()}
                  onShare={onShare}
                />
              </div>
            )}

            {/* Continue button */}
            <button
              onClick={onClose}
              className={`
                w-full mt-6 px-6 py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r ${colors.gradient}
                hover:opacity-90 transition-opacity
                shadow-lg
              `}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
        .animate-fade-up { animation: fade-up 0.5s ease-out both; }
        .delay-100 { animation-delay: 0.1s; }
      `}</style>
    </>
  );
}

export default CelebrationModal;

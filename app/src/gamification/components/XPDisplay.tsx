import { useEffect, useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";

interface XPDisplayProps {
  totalXp: number;
  currentXp: number;
  xpForNextLevel: number;
  level: number;
  levelTitle: string;
  levelEmoji: string;
  compact?: boolean;
  showLevel?: boolean;
  animated?: boolean;
}

// Animated number counter
function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = displayValue;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + (value - startValue) * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="tabular-nums">{displayValue.toLocaleString()}</span>;
}

export function XPDisplay({
  totalXp,
  currentXp,
  xpForNextLevel,
  level,
  levelTitle,
  levelEmoji,
  compact = false,
  showLevel = true,
  animated = true,
}: XPDisplayProps) {
  const progress = Math.round((currentXp / xpForNextLevel) * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-sm font-semibold text-violet-300">
            {animated ? <AnimatedNumber value={totalXp} duration={500} /> : totalXp.toLocaleString()}
          </span>
          <span className="text-xs text-violet-400/60">XP</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with level and XP */}
      <div className="flex items-center justify-between">
        {showLevel && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelEmoji}</span>
            <div>
              <div className="text-sm font-semibold text-white">Level {level}</div>
              <div className="text-xs text-zinc-500">{levelTitle}</div>
            </div>
          </div>
        )}
        <div className="text-right">
          <div className="flex items-center gap-1 text-violet-400">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold">
              {animated ? <AnimatedNumber value={totalXp} /> : totalXp.toLocaleString()}
            </span>
            <span className="text-zinc-500 text-sm">XP</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="relative h-3 rounded-full bg-zinc-800/50 overflow-hidden">
          {/* Animated background glow */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.5) ${progress}%, transparent ${progress}%)`,
            }}
          />
          {/* Progress fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">
            <span className="text-violet-400 font-medium">{currentXp}</span> / {xpForNextLevel} XP
          </span>
          <span className="text-zinc-500">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            Level {level + 1}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default XPDisplay;

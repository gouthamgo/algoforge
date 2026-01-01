import { useEffect, useState } from "react";
import { Target, CheckCircle2, Sparkles, PartyPopper } from "lucide-react";

interface DailyGoalProps {
  target: number;
  completed: number;
  compact?: boolean;
  showCelebration?: boolean;
  onCelebrationComplete?: () => void;
}

export function DailyGoal({
  target,
  completed,
  compact = false,
  showCelebration = true,
  onCelebrationComplete,
}: DailyGoalProps) {
  const [showComplete, setShowComplete] = useState(false);
  const progress = Math.min(Math.round((completed / target) * 100), 100);
  const isComplete = completed >= target;

  // Show celebration when goal is completed
  useEffect(() => {
    if (isComplete && showCelebration) {
      setShowComplete(true);
      const timer = setTimeout(() => {
        setShowComplete(false);
        onCelebrationComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, showCelebration, onCelebrationComplete]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-lg border
            ${isComplete
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-amber-500/10 border-amber-500/30"
            }
          `}
        >
          {isComplete ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Target className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span className={`text-sm font-semibold ${isComplete ? "text-emerald-300" : "text-amber-300"}`}>
            {completed}/{target}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Celebration overlay */}
      {showComplete && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-emerald-500/20 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-2 animate-bounce-in">
            <PartyPopper className="h-8 w-8 text-emerald-400" />
            <span className="text-lg font-bold text-emerald-400">Goal Complete!</span>
            <span className="text-sm text-emerald-300/80">+10 XP Bonus</span>
          </div>
        </div>
      )}

      <div
        className={`
          p-5 rounded-2xl border transition-all duration-500
          ${isComplete
            ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30"
            : "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                h-10 w-10 rounded-xl flex items-center justify-center
                ${isComplete ? "bg-emerald-500/20" : "bg-amber-500/20"}
              `}
            >
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Target className="h-5 w-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">Daily Goal</h3>
              <p className="text-xs text-zinc-500">
                {isComplete ? "Completed for today!" : "Keep going!"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${isComplete ? "text-emerald-400" : "text-amber-400"}`}>
              {completed}
            </span>
            <span className="text-zinc-500">/{target}</span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: target }).map((_, i) => (
            <div
              key={i}
              className={`
                flex-1 h-3 rounded-full transition-all duration-300
                ${i < completed
                  ? isComplete
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                    : "bg-amber-500 shadow-lg shadow-amber-500/30"
                  : "bg-zinc-800"
                }
              `}
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative h-2 rounded-full bg-zinc-800/50 overflow-hidden">
          <div
            className={`
              absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out
              ${isComplete
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-amber-500 to-orange-500"
              }
            `}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Reward preview */}
        {!isComplete && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>Complete for <span className="text-violet-400 font-semibold">+10 XP</span> bonus</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Mini version for inline display
export function DailyGoalMini({ target, completed }: { target: number; completed: number }) {
  const isComplete = completed >= target;

  return (
    <div className="inline-flex items-center gap-1.5">
      {isComplete ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      ) : (
        <Target className="h-4 w-4 text-amber-400" />
      )}
      <span className={`text-sm font-medium ${isComplete ? "text-emerald-400" : "text-zinc-400"}`}>
        {completed}/{target}
      </span>
    </div>
  );
}

export default DailyGoal;

import { TrendingUp, Target, CheckCircle2 } from "lucide-react";

interface PathProgressProps {
  progress: number;
  solved: number;
  total: number;
  showMilestones?: boolean;
}

const MILESTONES = [
  { percent: 25, label: "25%", emoji: "🌱" },
  { percent: 50, label: "Halfway!", emoji: "🎯" },
  { percent: 75, label: "75%", emoji: "🔥" },
  { percent: 100, label: "Complete!", emoji: "🏆" },
];

export function PathProgress({
  progress,
  solved,
  total,
  showMilestones = true,
}: PathProgressProps) {
  const nextMilestone = MILESTONES.find((m) => m.percent > progress);
  const problemsToNextMilestone = nextMilestone
    ? Math.ceil((nextMilestone.percent / 100) * total) - solved
    : 0;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Overall Progress</h3>
            <p className="text-xs text-zinc-500">
              {solved} of {total} problems solved
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-emerald-400">{progress}%</span>
        </div>
      </div>

      {/* Progress bar with milestones */}
      <div className="relative mb-4">
        {/* Background bar */}
        <div className="h-4 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Milestone markers */}
        {showMilestones && (
          <div className="absolute inset-x-0 top-0 h-4">
            {MILESTONES.map((milestone) => (
              <div
                key={milestone.percent}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${milestone.percent}%` }}
              >
                <div
                  className={`
                    h-6 w-6 -ml-3 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${progress >= milestone.percent
                      ? "bg-emerald-500 text-white scale-110"
                      : "bg-zinc-700 text-zinc-500 scale-100"
                    }
                  `}
                >
                  {progress >= milestone.percent ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{milestone.percent}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestone labels */}
      {showMilestones && (
        <div className="relative h-6 mb-4">
          {MILESTONES.map((milestone) => (
            <div
              key={milestone.percent}
              className="absolute -translate-x-1/2 text-center"
              style={{ left: `${milestone.percent}%` }}
            >
              <span
                className={`
                  text-xs font-medium
                  ${progress >= milestone.percent ? "text-emerald-400" : "text-zinc-600"}
                `}
              >
                {progress >= milestone.percent ? milestone.emoji : milestone.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Next milestone info */}
      {nextMilestone && problemsToNextMilestone > 0 && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-sm">
          <Target className="h-4 w-4 text-zinc-500" />
          <span className="text-zinc-400">
            <span className="text-white font-medium">{problemsToNextMilestone}</span> more problems to reach{" "}
            <span className="text-emerald-400 font-medium">{nextMilestone.label}</span>
          </span>
        </div>
      )}

      {progress === 100 && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm">
          <span className="text-2xl">🏆</span>
          <span className="text-emerald-400 font-medium">
            Congratulations! You've mastered all patterns!
          </span>
        </div>
      )}

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

export default PathProgress;

import { Link } from "react-router-dom";
import { Lock, ChevronRight, CheckCircle2, Crown } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface PatternProgress {
  slug: string;
  title: string;
  totalProblems: number;
  solvedProblems: number;
  progress: number;
  isPremium: boolean;
  isLocked: boolean;
  isPriority: boolean;
}

interface PhaseCardProps {
  phase: {
    id: number;
    name: string;
    description: string;
    icon: string;
    emoji: string;
    color: string;
    bgColor: string;
    borderColor: string;
    patterns: PatternProgress[];
    totalProblems: number;
    solvedProblems: number;
    progress: number;
    isPremium: boolean;
    isLocked: boolean;
    isComplete: boolean;
  };
  compact?: boolean;
}

// Get icon component from string name
function getIcon(iconName: string) {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Layers;
}

export function PhaseCard({ phase, compact = false }: PhaseCardProps) {
  const Icon = getIcon(phase.icon);

  if (compact) {
    return (
      <div
        className={`
          relative p-4 rounded-xl border transition-all duration-300
          ${phase.isLocked
            ? "bg-zinc-900/50 border-zinc-800/50 opacity-60"
            : `${phase.bgColor} ${phase.borderColor}`
          }
          ${phase.isComplete ? "ring-2 ring-emerald-500/30" : ""}
        `}
      >
        {/* Lock overlay */}
        {phase.isLocked && (
          <div className="absolute top-2 right-2">
            <Lock className="h-4 w-4 text-zinc-600" />
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${phase.color}20` }}
          >
            <span className="text-xl">{phase.emoji}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{phase.name}</h3>
              {phase.isPremium && !phase.isLocked && (
                <Crown className="h-3.5 w-3.5 text-amber-400" />
              )}
              {phase.isComplete && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>{phase.patterns.length} patterns</span>
              <span>•</span>
              <span>{phase.solvedProblems}/{phase.totalProblems} solved</span>
            </div>
          </div>

          {/* Progress */}
          <div className="text-right">
            <span
              className="text-lg font-bold"
              style={{ color: phase.color }}
            >
              {phase.progress}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${phase.progress}%`,
              backgroundColor: phase.color,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative p-6 rounded-2xl border transition-all duration-300
        ${phase.isLocked
          ? "bg-zinc-900/50 border-zinc-800/50"
          : `${phase.bgColor} ${phase.borderColor} hover:border-opacity-60`
        }
        ${phase.isComplete ? "ring-2 ring-emerald-500/20" : ""}
      `}
    >
      {/* Lock overlay */}
      {phase.isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-zinc-900/80 z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-zinc-500 text-sm">Premium Content</p>
            <Link
              to="/pricing"
              className="mt-2 inline-block text-violet-400 text-sm hover:text-violet-300"
            >
              Upgrade to unlock
            </Link>
          </div>
        </div>
      )}

      <div className={phase.isLocked ? "opacity-30" : ""}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${phase.color}20` }}
            >
              <span className="text-2xl">{phase.emoji}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{phase.name}</h3>
                {phase.isPremium && (
                  <Crown className="h-4 w-4 text-amber-400" />
                )}
              </div>
              <p className="text-sm text-zinc-400">{phase.description}</p>
            </div>
          </div>

          {phase.isComplete && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Complete</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">
              {phase.solvedProblems} of {phase.totalProblems} problems
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: phase.color }}
            >
              {phase.progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${phase.progress}%`,
                backgroundColor: phase.color,
              }}
            />
          </div>
        </div>

        {/* Patterns */}
        <div className="space-y-2">
          {phase.patterns.map((pattern) => (
            <Link
              key={pattern.slug}
              to={`/problems?pattern=${pattern.slug}`}
              className={`
                flex items-center justify-between p-3 rounded-xl
                transition-all duration-200 group
                ${pattern.isLocked
                  ? "bg-zinc-800/30 cursor-not-allowed"
                  : "bg-white/5 hover:bg-white/10"
                }
              `}
              onClick={(e) => pattern.isLocked && e.preventDefault()}
            >
              <div className="flex items-center gap-3">
                {pattern.isLocked ? (
                  <Lock className="h-4 w-4 text-zinc-600" />
                ) : pattern.progress === 100 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <div
                    className="h-4 w-4 rounded-full border-2"
                    style={{ borderColor: phase.color }}
                  />
                )}
                <span className={`text-sm ${pattern.isLocked ? "text-zinc-600" : "text-zinc-300"}`}>
                  {pattern.title}
                </span>
                {pattern.isPriority && !pattern.isLocked && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-500/20 text-violet-400">
                    Priority
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  {pattern.solvedProblems}/{pattern.totalProblems}
                </span>
                {!pattern.isLocked && (
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhaseCard;

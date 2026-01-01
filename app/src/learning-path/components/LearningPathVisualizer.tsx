import { useState } from "react";
import { useQuery } from "wasp/client/operations";
import { getLearningPath } from "wasp/client/operations";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Map, TrendingUp, Lock, ArrowRight, Sparkles } from "lucide-react";
import { PhaseCard } from "./PhaseCard";
import { PathProgress } from "./PathProgress";

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

interface Phase {
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
}

interface LearningPathVisualizerProps {
  compact?: boolean;
  showRecommendation?: boolean;
}

export function LearningPathVisualizer({
  compact = false,
  showRecommendation = true,
}: LearningPathVisualizerProps) {
  const { data, isLoading, error } = useQuery(getLearningPath);
  const [isExpanded, setIsExpanded] = useState(!compact);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-zinc-800" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
            <div className="h-3 w-48 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
        <p className="text-red-400">Failed to load learning path</p>
      </div>
    );
  }

  const { phases, overallProgress, totalProblems, totalSolved, currentPhaseId, recommendedPattern, isPremium } = data;

  if (compact && !isExpanded) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Map className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Learning Path</h3>
              <p className="text-xs text-zinc-500">
                {totalSolved} of {totalProblems} problems completed
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
          >
            Expand
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-500">Overall Progress</span>
            <span className="text-sm font-semibold text-violet-400">{overallProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Phase dots */}
        <div className="flex items-center justify-between">
          {phases.map((phase: Phase, i: number) => (
            <div
              key={phase.id}
              className="flex flex-col items-center gap-1"
              title={phase.name}
            >
              <div
                className={`
                  h-8 w-8 rounded-lg flex items-center justify-center text-sm
                  transition-all duration-300
                  ${phase.isLocked
                    ? "bg-zinc-800 text-zinc-600"
                    : phase.isComplete
                    ? "bg-emerald-500/20 text-emerald-400"
                    : phase.id === currentPhaseId
                    ? "bg-violet-500/20 text-violet-400 ring-2 ring-violet-500/50"
                    : `bg-opacity-20 text-opacity-80`
                  }
                `}
                style={!phase.isLocked && !phase.isComplete && phase.id !== currentPhaseId ? {
                  backgroundColor: `${phase.color}20`,
                  color: phase.color,
                } : undefined}
              >
                {phase.isLocked ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  phase.emoji
                )}
              </div>
              <span className="text-[10px] text-zinc-600">{phase.progress}%</span>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        {showRecommendation && recommendedPattern && (
          <Link
            to={`/problems?pattern=${recommendedPattern.slug}`}
            className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-colors group"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-500">Continue with</p>
              <p className="text-sm font-medium text-white truncate">{recommendedPattern.title}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Map className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Learning Path</h2>
            <p className="text-sm text-zinc-400">
              6 phases, 15 patterns, {totalProblems} problems
            </p>
          </div>
        </div>
        {compact && (
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
          >
            Collapse
            <ChevronUp className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Overall progress */}
      <PathProgress
        progress={overallProgress}
        solved={totalSolved}
        total={totalProblems}
      />

      {/* Recommendation card */}
      {showRecommendation && recommendedPattern && (
        <Link
          to={`/problems?pattern=${recommendedPattern.slug}`}
          className="block p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/5 border border-violet-500/20 hover:border-violet-500/40 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-400 mb-1">Recommended Next</p>
              <h3 className="text-lg font-semibold text-white group-hover:text-violet-200 transition-colors">
                {recommendedPattern.title}
              </h3>
              <p className="text-sm text-zinc-500">{recommendedPattern.phaseName}</p>
            </div>
            <ArrowRight className="h-6 w-6 text-violet-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      )}

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase: Phase) => (
          <PhaseCard key={phase.id} phase={phase} compact={compact} />
        ))}
      </div>

      {/* Premium upsell */}
      {!isPremium && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Lock className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Unlock All Phases</h3>
              <p className="text-sm text-zinc-400">
                Get access to advanced patterns and more problems
              </p>
            </div>
            <Link
              to="/pricing"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningPathVisualizer;

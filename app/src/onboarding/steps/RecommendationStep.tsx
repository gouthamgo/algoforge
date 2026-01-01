import { ArrowLeft, Rocket, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { GOAL_PRIORITIES } from "../../gamification/constants";

// Import core patterns from shared constants if needed
const CORE_PATTERN_NAMES: Record<string, string> = {
  "arrays-hashing": "Arrays & Hashing",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  stack: "Stack",
  "binary-search": "Binary Search",
  "linked-list": "Linked List",
  trees: "Trees",
  tries: "Tries",
  "heap-priority-queue": "Heap / Priority Queue",
  backtracking: "Backtracking",
  graphs: "Graphs",
  "dynamic-programming-1d": "1D Dynamic Programming",
  "dynamic-programming-2d": "2D Dynamic Programming",
  greedy: "Greedy",
  intervals: "Intervals",
};

interface RecommendationStepProps {
  goal: string;
  experienceLevel: string;
  timeCommitment: string;
  onComplete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function RecommendationStep({
  goal,
  experienceLevel,
  timeCommitment,
  onComplete,
  onBack,
  isLoading = false,
}: RecommendationStepProps) {
  const goalPriority = GOAL_PRIORITIES[goal];
  const priorityPatterns = goalPriority?.patterns.slice(0, 3) || [];

  // Calculate suggested daily goal
  let suggestedDailyGoal = goalPriority?.dailyGoalSuggestion || 3;
  if (experienceLevel === "beginner") suggestedDailyGoal = Math.max(1, suggestedDailyGoal - 1);
  if (timeCommitment === "15min") suggestedDailyGoal = Math.min(suggestedDailyGoal, 2);
  if (timeCommitment === "weekends") suggestedDailyGoal = Math.min(suggestedDailyGoal, 3);

  return (
    <div className="flex flex-col px-4 py-6 animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">Your personalized path is ready!</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Here's Your Learning Plan
        </h2>
        <p className="text-zinc-400">
          Based on your preferences, we've crafted the perfect journey
        </p>
      </div>

      {/* Recommendations */}
      <div className="max-w-lg mx-auto w-full space-y-4 mb-8">
        {/* Daily Goal */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Daily Goal</h3>
              <p className="text-sm text-zinc-500">Problems per day</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-amber-400">{suggestedDailyGoal}</span>
            <span className="text-zinc-400">problems/day</span>
          </div>
        </div>

        {/* Priority Patterns */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Priority Patterns</h3>
              <p className="text-sm text-zinc-500">Start with these</p>
            </div>
          </div>
          <div className="space-y-2">
            {priorityPatterns.map((pattern, i) => (
              <div
                key={pattern}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
              >
                <span className="text-violet-400 font-mono text-sm">{i + 1}</span>
                <span className="text-white">{CORE_PATTERN_NAMES[pattern] || pattern}</span>
                <CheckCircle2 className="h-4 w-4 text-violet-400 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Pace */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <span className="text-xl">
                  {goalPriority?.pace === "intensive" ? "🚀" :
                   goalPriority?.pace === "moderate" ? "🎯" :
                   goalPriority?.pace === "steady" ? "📈" : "🌿"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Learning Pace</h3>
                <p className="text-sm text-zinc-500 capitalize">{goalPriority?.pace || "moderate"}</p>
              </div>
            </div>
            <span className="text-cyan-400 text-sm font-medium capitalize">
              {goalPriority?.pace || "Moderate"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          onClick={onComplete}
          disabled={isLoading}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              Start Learning
              <Rocket className="h-5 w-5" />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default RecommendationStep;

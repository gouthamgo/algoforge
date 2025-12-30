import { useQuery } from "wasp/client/operations";
import { getRoadmap } from "wasp/client/operations";
import { Link } from "react-router-dom";
import {
  Hash,
  ArrowLeftRight,
  PanelLeftClose,
  Layers,
  Search,
  Link as LinkIcon,
  GitBranch,
  FolderTree,
  Mountain,
  Undo2,
  Share2,
  TrendingUp,
  Grid3X3,
  Zap,
  CalendarRange,
  ChevronRight,
  Lock,
  CheckCircle2,
  Circle,
  BookOpen,
  Target,
} from "lucide-react";

// The 15 core patterns with proper data
const PATTERNS_DATA = [
  {
    order: 1,
    slug: "arrays-hashing",
    title: "Arrays & Hashing",
    description: "Foundation of all DSA. Hash maps for O(1) lookups.",
    icon: Hash,
    color: "violet",
    problemCount: 50,
  },
  {
    order: 2,
    slug: "two-pointers",
    title: "Two Pointers",
    description: "Efficient traversal with two moving pointers.",
    icon: ArrowLeftRight,
    color: "cyan",
    problemCount: 30,
  },
  {
    order: 3,
    slug: "sliding-window",
    title: "Sliding Window",
    description: "Optimize subarray/substring problems.",
    icon: PanelLeftClose,
    color: "emerald",
    problemCount: 25,
  },
  {
    order: 4,
    slug: "stack",
    title: "Stack",
    description: "LIFO structure for parsing and backtracking.",
    icon: Layers,
    color: "amber",
    problemCount: 20,
  },
  {
    order: 5,
    slug: "binary-search",
    title: "Binary Search",
    description: "Divide and conquer for sorted data.",
    icon: Search,
    color: "rose",
    problemCount: 30,
  },
  {
    order: 6,
    slug: "linked-list",
    title: "Linked List",
    description: "Pointer manipulation and cycle detection.",
    icon: LinkIcon,
    color: "violet",
    problemCount: 25,
  },
  {
    order: 7,
    slug: "trees",
    title: "Trees",
    description: "Hierarchical data and recursive thinking.",
    icon: GitBranch,
    color: "emerald",
    problemCount: 40,
  },
  {
    order: 8,
    slug: "tries",
    title: "Tries",
    description: "Prefix trees for string operations.",
    icon: FolderTree,
    color: "cyan",
    problemCount: 10,
  },
  {
    order: 9,
    slug: "heap-priority-queue",
    title: "Heap / Priority Queue",
    description: "Efficient min/max extraction.",
    icon: Mountain,
    color: "amber",
    problemCount: 20,
  },
  {
    order: 10,
    slug: "backtracking",
    title: "Backtracking",
    description: "Explore all possibilities systematically.",
    icon: Undo2,
    color: "rose",
    problemCount: 25,
  },
  {
    order: 11,
    slug: "graphs",
    title: "Graphs",
    description: "BFS, DFS, and graph algorithms.",
    icon: Share2,
    color: "violet",
    problemCount: 35,
  },
  {
    order: 12,
    slug: "dynamic-programming-1d",
    title: "1D Dynamic Programming",
    description: "Optimize with memoization.",
    icon: TrendingUp,
    color: "emerald",
    problemCount: 30,
  },
  {
    order: 13,
    slug: "dynamic-programming-2d",
    title: "2D Dynamic Programming",
    description: "Grid and string DP problems.",
    icon: Grid3X3,
    color: "cyan",
    problemCount: 25,
  },
  {
    order: 14,
    slug: "greedy",
    title: "Greedy",
    description: "Local optimal choices for global solution.",
    icon: Zap,
    color: "amber",
    problemCount: 20,
  },
  {
    order: 15,
    slug: "intervals",
    title: "Intervals",
    description: "Merge, insert, and schedule intervals.",
    icon: CalendarRange,
    color: "rose",
    problemCount: 15,
  },
];

// Color mapping for consistent styling
const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/10",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    glow: "shadow-cyan-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/10",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/10",
  },
};

export default function RoadmapPage() {
  const { data: dbPatterns, isLoading } = useQuery(getRoadmap);

  // Merge database data with our static pattern data
  const patterns = PATTERNS_DATA.map((pattern) => {
    const dbPattern = dbPatterns?.find(
      (p: any) => p.patterns?.some((pat: any) => pat.slug === pattern.slug)
    );
    const dbPatternData = dbPattern?.patterns?.find((p: any) => p.slug === pattern.slug);

    return {
      ...pattern,
      solvedCount: dbPatternData?.solvedCount || 0,
      totalProblems: dbPatternData?.totalProblems || pattern.problemCount,
      isAvailable: !!dbPatternData,
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500">Loading roadmap...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070a]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-violet-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              The 15 Core Patterns
            </h1>
          </div>
          <p className="text-zinc-400 ml-13 max-w-2xl">
            Master these patterns and you'll be able to solve 90% of coding interview problems.
            Work through them in order for the best learning experience.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-zinc-400">
                <span className="text-white font-medium">
                  {patterns.filter(p => p.solvedCount > 0).length}
                </span>
                /15 patterns started
              </span>
            </div>
            <div className="h-4 w-px bg-zinc-700" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-zinc-400">
                <span className="text-white font-medium">
                  {patterns.reduce((sum, p) => sum + p.solvedCount, 0)}
                </span>
                /{patterns.reduce((sum, p) => sum + p.totalProblems, 0)} problems solved
              </span>
            </div>
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map((pattern) => {
              const colors = colorMap[pattern.color];
              const Icon = pattern.icon;
              const progress = pattern.solvedCount > 0
                ? Math.round((pattern.solvedCount / pattern.totalProblems) * 100)
                : 0;
              const isStarted = pattern.solvedCount > 0;

              return (
                <Link
                  key={pattern.slug}
                  to={pattern.isAvailable ? `/problems?pattern=${pattern.slug}` : "#"}
                  className={`group relative rounded-xl border bg-zinc-900/30 p-5 transition-all hover:bg-zinc-900/60 ${
                    pattern.isAvailable
                      ? `border-zinc-800 hover:${colors.border} cursor-pointer`
                      : "border-zinc-800/50 opacity-60 cursor-default"
                  }`}
                >
                  {/* Order Badge */}
                  <div className={`absolute -top-2.5 -left-2.5 h-6 w-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-xs font-bold border ${colors.border}`}>
                    {pattern.order}
                  </div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    {!pattern.isAvailable && (
                      <span className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-500 rounded">
                        Coming Soon
                      </span>
                    )}
                    {isStarted && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                        {progress}%
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
                    {pattern.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                    {pattern.description}
                  </p>

                  {/* Progress Bar - Only show if started */}
                  {isStarted ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">
                          {pattern.solvedCount}/{pattern.totalProblems} solved
                        </span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pattern.color === "violet" ? "bg-violet-500" :
                            pattern.color === "cyan" ? "bg-cyan-500" :
                            pattern.color === "emerald" ? "bg-emerald-500" :
                            pattern.color === "amber" ? "bg-amber-500" :
                            "bg-rose-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-600">
                        {pattern.totalProblems} problems
                      </span>
                      {pattern.isAvailable && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-violet-400 transition-colors">
                          Start learning
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Learning Path Note */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
            <h3 className="text-sm font-medium text-white mb-2">Recommended Learning Path</h3>
            <p className="text-sm text-zinc-500">
              Start with <span className="text-violet-400">Arrays & Hashing</span> to build your foundation,
              then progress through <span className="text-cyan-400">Two Pointers</span> and{" "}
              <span className="text-emerald-400">Sliding Window</span>.
              These three patterns alone will help you solve many interview problems.
              Continue through the rest in order as each pattern builds on concepts from earlier ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

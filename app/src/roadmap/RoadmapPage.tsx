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
  Play,
  Sparkles,
} from "lucide-react";

// The 15 core patterns organized into learning tiers
const SKILL_TREE = {
  tiers: [
    {
      name: "Foundation",
      description: "Master the basics",
      patterns: [
        {
          id: 1,
          slug: "arrays-hashing",
          title: "Arrays & Hashing",
          shortTitle: "Arrays",
          description: "Hash maps for O(1) lookups. The foundation of everything.",
          icon: Hash,
          color: "#8b5cf6",
          problemCount: 9,
          keyProblems: ["Two Sum", "Contains Duplicate", "Valid Anagram"],
        },
      ],
    },
    {
      name: "Traversal Patterns",
      description: "Learn to navigate data efficiently",
      patterns: [
        {
          id: 2,
          slug: "two-pointers",
          title: "Two Pointers",
          shortTitle: "2 Pointers",
          description: "Efficient traversal with two moving pointers.",
          icon: ArrowLeftRight,
          color: "#06b6d4",
          problemCount: 5,
          keyProblems: ["Valid Palindrome", "3Sum", "Container With Most Water"],
        },
        {
          id: 3,
          slug: "sliding-window",
          title: "Sliding Window",
          shortTitle: "Window",
          description: "Optimize subarray and substring problems.",
          icon: PanelLeftClose,
          color: "#10b981",
          problemCount: 6,
          keyProblems: ["Best Time to Buy Stock", "Longest Substring", "Minimum Window"],
        },
      ],
    },
    {
      name: "Data Structures",
      description: "Essential structures for problem solving",
      patterns: [
        {
          id: 4,
          slug: "stack",
          title: "Stack",
          shortTitle: "Stack",
          description: "LIFO structure for parsing and backtracking.",
          icon: Layers,
          color: "#f59e0b",
          problemCount: 7,
          keyProblems: ["Valid Parentheses", "Min Stack", "Evaluate RPN"],
        },
        {
          id: 5,
          slug: "binary-search",
          title: "Binary Search",
          shortTitle: "Binary Search",
          description: "Divide and conquer for sorted data.",
          icon: Search,
          color: "#ec4899",
          problemCount: 7,
          keyProblems: ["Binary Search", "Search Matrix", "Koko Eating Bananas"],
        },
        {
          id: 6,
          slug: "linked-list",
          title: "Linked List",
          shortTitle: "Linked List",
          description: "Pointer manipulation and cycle detection.",
          icon: LinkIcon,
          color: "#8b5cf6",
          problemCount: 11,
          keyProblems: ["Reverse Linked List", "Merge Two Lists", "Linked List Cycle"],
        },
      ],
    },
    {
      name: "Hierarchical",
      description: "Trees and prefix structures",
      patterns: [
        {
          id: 7,
          slug: "trees",
          title: "Trees",
          shortTitle: "Trees",
          description: "Hierarchical data and recursive thinking.",
          icon: GitBranch,
          color: "#10b981",
          problemCount: 15,
          keyProblems: ["Invert Tree", "Max Depth", "Level Order Traversal"],
        },
        {
          id: 8,
          slug: "tries",
          title: "Tries",
          shortTitle: "Trie",
          description: "Prefix trees for string operations.",
          icon: FolderTree,
          color: "#06b6d4",
          problemCount: 3,
          keyProblems: ["Implement Trie", "Word Search II", "Design Add Search"],
        },
        {
          id: 9,
          slug: "heap-priority-queue",
          title: "Heap / Priority Queue",
          shortTitle: "Heap / PQ",
          description: "Efficient min/max extraction.",
          icon: Mountain,
          color: "#f59e0b",
          problemCount: 7,
          keyProblems: ["Kth Largest", "Last Stone Weight", "K Closest Points"],
        },
      ],
    },
    {
      name: "Advanced Techniques",
      description: "Complex problem-solving strategies",
      patterns: [
        {
          id: 10,
          slug: "backtracking",
          title: "Backtracking",
          shortTitle: "Backtrack",
          description: "Explore all possibilities systematically.",
          icon: Undo2,
          color: "#ec4899",
          problemCount: 9,
          keyProblems: ["Subsets", "Permutations", "N-Queens"],
        },
        {
          id: 11,
          slug: "graphs",
          title: "Graphs",
          shortTitle: "Graphs",
          description: "BFS, DFS, and graph algorithms.",
          icon: Share2,
          color: "#8b5cf6",
          problemCount: 13,
          keyProblems: ["Number of Islands", "Clone Graph", "Course Schedule"],
        },
      ],
    },
    {
      name: "Dynamic Programming",
      description: "Optimize with memoization",
      patterns: [
        {
          id: 12,
          slug: "dynamic-programming-1d",
          title: "1D Dynamic Programming",
          shortTitle: "1D DP",
          description: "Single dimension optimization.",
          icon: TrendingUp,
          color: "#10b981",
          problemCount: 10,
          keyProblems: ["Climbing Stairs", "House Robber", "Longest Increasing"],
        },
        {
          id: 13,
          slug: "dynamic-programming-2d",
          title: "2D Dynamic Programming",
          shortTitle: "2D DP",
          description: "Grid and string DP problems.",
          icon: Grid3X3,
          color: "#06b6d4",
          problemCount: 11,
          keyProblems: ["Unique Paths", "LCS", "Edit Distance"],
        },
      ],
    },
    {
      name: "Optimization",
      description: "Final mastery patterns",
      patterns: [
        {
          id: 14,
          slug: "greedy",
          title: "Greedy",
          shortTitle: "Greedy",
          description: "Local optimal for global solution.",
          icon: Zap,
          color: "#f59e0b",
          problemCount: 8,
          keyProblems: ["Jump Game", "Gas Station", "Hand of Straights"],
        },
        {
          id: 15,
          slug: "intervals",
          title: "Intervals",
          shortTitle: "Intervals",
          description: "Merge, insert, and schedule.",
          icon: CalendarRange,
          color: "#ec4899",
          problemCount: 6,
          keyProblems: ["Merge Intervals", "Insert Interval", "Meeting Rooms"],
        },
      ],
    },
  ],
};

// Flatten patterns for easy lookup
const ALL_PATTERNS = SKILL_TREE.tiers.flatMap((tier) => tier.patterns);

export default function RoadmapPage() {
  const { data: dbData, isLoading } = useQuery(getRoadmap);

  // Merge DB data with static pattern data
  const getPatternProgress = (slug: string) => {
    if (!dbData) return { solved: 0, total: 0, progress: 0, isUnlocked: true };

    for (const topic of dbData) {
      const pattern = topic.patterns?.find((p: any) => p.slug === slug);
      if (pattern) {
        return {
          solved: pattern.solvedCount || 0,
          total: pattern.problemCount || 0,
          progress: pattern.progress || 0,
          isUnlocked: true,
        };
      }
    }
    return { solved: 0, total: 0, progress: 0, isUnlocked: false };
  };

  const totalSolved = ALL_PATTERNS.reduce((sum, p) => sum + getPatternProgress(p.slug).solved, 0);
  const totalProblems = ALL_PATTERNS.reduce((sum, p) => {
    const prog = getPatternProgress(p.slug);
    return sum + (prog.total || p.problemCount);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-violet-500/30" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
          <span className="text-zinc-500 font-mono text-sm">LOADING SKILL TREE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-mono text-violet-300">YOUR LEARNING JOURNEY</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Master the{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              15 Core Patterns
            </span>
          </h1>

          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Follow the path from foundation to mastery. Each pattern unlocks the next.
            Complete them in order for the best learning experience.
          </p>

          {/* Progress bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-500">Overall Progress</span>
              <span className="font-mono text-violet-400">{totalSolved}/{totalProblems} solved</span>
            </div>
            <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skill Tree */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/30 to-emerald-500/50 transform -translate-x-1/2" />

          {SKILL_TREE.tiers.map((tier, tierIndex) => {
            const isEvenTier = tierIndex % 2 === 0;

            return (
              <div key={tier.name} className="relative mb-8 last:mb-0">
                {/* Tier header node */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl" />

                    <div className="relative px-6 py-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-full">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {tierIndex + 1}
                        </div>
                        <div>
                          <h2 className="font-semibold text-white text-sm">{tier.name}</h2>
                          <p className="text-xs text-zinc-500">{tier.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pattern nodes */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                  {tier.patterns.map((pattern) => {
                    const progress = getPatternProgress(pattern.slug);
                    const isCompleted = progress.solved > 0 && progress.solved === progress.total;
                    const isStarted = progress.solved > 0;
                    const Icon = pattern.icon;

                    return (
                      <div key={pattern.slug} className="relative">
                        {/* Pattern node - now a Link */}
                        <Link
                          to={`/problems?pattern=${pattern.slug}`}
                          className="relative group w-48 block transition-all duration-300 hover:scale-105"
                        >
                          {/* Glow effect on hover */}
                          <div
                            className="absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            style={{ backgroundColor: `${pattern.color}30` }}
                          />

                          {/* Card */}
                          <div
                            className={`
                              relative rounded-2xl border backdrop-blur-sm p-4 transition-all duration-300
                              ${isCompleted
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : isStarted
                                  ? 'bg-zinc-900/80 border-zinc-700'
                                  : 'bg-zinc-900/50 border-zinc-800'
                              }
                              group-hover:border-opacity-100
                            `}
                            style={{
                              borderColor: `${pattern.color}40`,
                            }}
                          >
                            {/* Status indicator */}
                            <div className="absolute -top-2 -right-2">
                              {isCompleted ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                              ) : isStarted ? (
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                                  style={{ backgroundColor: pattern.color, boxShadow: `0 4px 12px ${pattern.color}40` }}
                                >
                                  <Play className="w-3 h-3 text-white" />
                                </div>
                              ) : null}
                            </div>

                            {/* Icon */}
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-transform group-hover:scale-110"
                              style={{ backgroundColor: `${pattern.color}20` }}
                            >
                              <Icon
                                className="w-6 h-6 transition-colors"
                                style={{ color: pattern.color }}
                              />
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-white text-sm text-center mb-1 group-hover:text-white">
                              {pattern.shortTitle}
                            </h3>

                            {/* Description - visible on hover */}
                            <p className="text-xs text-zinc-500 text-center mb-3 line-clamp-2 h-8">
                              {pattern.description}
                            </p>

                            {/* Progress */}
                            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                              <span>{progress.solved || 0}/{progress.total || pattern.problemCount}</span>
                              <span className="group-hover:text-white transition-colors flex items-center gap-1">
                                {isStarted ? 'Continue' : 'Start'} <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${progress.progress}%`,
                                  backgroundColor: isCompleted ? '#10b981' : pattern.color,
                                }}
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Final node - completion */}
          <div className="flex justify-center mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse" />

              <div className="relative w-24 h-24 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <span className="text-xs font-mono text-zinc-500">MASTER</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700" />
            <span className="text-zinc-500">Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500/50" />
            <span className="text-zinc-500">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-zinc-500">Completed</span>
          </div>
        </div>
      </div>

    </div>
  );
}

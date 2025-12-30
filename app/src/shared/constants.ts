// Core Patterns
export const CORE_PATTERNS = [
  {
    order: 1,
    slug: "arrays-hashing",
    title: "Arrays & Hashing",
    description: "Foundation of all DSA. Hash maps for O(1) lookups.",
    problemCount: 50,
    icon: "LayoutGrid",
  },
  {
    order: 2,
    slug: "two-pointers",
    title: "Two Pointers",
    description: "Efficient traversal with two moving pointers.",
    problemCount: 30,
    icon: "ArrowLeftRight",
  },
  {
    order: 3,
    slug: "sliding-window",
    title: "Sliding Window",
    description: "Optimize subarray/substring problems.",
    problemCount: 25,
    icon: "PanelLeftClose",
  },
  {
    order: 4,
    slug: "stack",
    title: "Stack",
    description: "LIFO structure for parsing and backtracking.",
    problemCount: 20,
    icon: "Layers",
  },
  {
    order: 5,
    slug: "binary-search",
    title: "Binary Search",
    description: "Divide and conquer for sorted data.",
    problemCount: 30,
    icon: "Search",
  },
  {
    order: 6,
    slug: "linked-list",
    title: "Linked List",
    description: "Pointer manipulation and cycle detection.",
    problemCount: 25,
    icon: "Link",
  },
  {
    order: 7,
    slug: "trees",
    title: "Trees",
    description: "Hierarchical data and recursive thinking.",
    problemCount: 40,
    icon: "GitBranch",
  },
  {
    order: 8,
    slug: "tries",
    title: "Tries",
    description: "Prefix trees for string operations.",
    problemCount: 10,
    icon: "FileTree",
  },
  {
    order: 9,
    slug: "heap-priority-queue",
    title: "Heap / Priority Queue",
    description: "Efficient min/max extraction.",
    problemCount: 20,
    icon: "Mountain",
  },
  {
    order: 10,
    slug: "backtracking",
    title: "Backtracking",
    description: "Explore all possibilities systematically.",
    problemCount: 25,
    icon: "Undo2",
  },
  {
    order: 11,
    slug: "graphs",
    title: "Graphs",
    description: "BFS, DFS, and graph algorithms.",
    problemCount: 35,
    icon: "Share2",
  },
  {
    order: 12,
    slug: "dynamic-programming-1d",
    title: "1D Dynamic Programming",
    description: "Optimize with memoization.",
    problemCount: 30,
    icon: "TrendingUp",
  },
  {
    order: 13,
    slug: "dynamic-programming-2d",
    title: "2D Dynamic Programming",
    description: "Grid and string DP problems.",
    problemCount: 25,
    icon: "Grid3X3",
  },
  {
    order: 14,
    slug: "greedy",
    title: "Greedy",
    description: "Local optimal choices for global solution.",
    problemCount: 20,
    icon: "Zap",
  },
  {
    order: 15,
    slug: "intervals",
    title: "Intervals",
    description: "Merge, insert, and schedule intervals.",
    problemCount: 15,
    icon: "CalendarRange",
  },
];

// Difficulty Configuration
export const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    xpMultiplier: 1,
    estimatedMinutes: 15,
  },
  medium: {
    label: "Medium",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
    xpMultiplier: 2,
    estimatedMinutes: 30,
  },
  hard: {
    label: "Hard",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
    xpMultiplier: 3,
    estimatedMinutes: 45,
  },
} as const;

// XP Rewards
export const XP_REWARDS = {
  solveProblemEasy: 10,
  solveProblemMedium: 25,
  solveProblemHard: 50,
  firstTryBonus: 5,
  speedBonus: 10,
  streakBonus: 5,
  completePattern: 100,
  completeTopic: 250,
  completeReview: 5,
  perfectReviewWeek: 50,
};

// Level Configuration
export const LEVEL_CONFIG = {
  xpForLevel: (level: number) => Math.floor(100 * Math.pow(1.5, level - 1)),
  titles: {
    1: "Novice",
    5: "Apprentice",
    10: "Junior Developer",
    15: "Developer",
    20: "Senior Developer",
    25: "Staff Engineer",
    30: "Principal Engineer",
    35: "Distinguished Engineer",
    40: "Fellow",
    50: "Legend",
  } as Record<number, string>,
};

// Streak Configuration
export const STREAK_CONFIG = {
  dailyMinimum: 1,
  freezeDays: 2,
  streakBonuses: {
    7: 50,
    30: 200,
    100: 500,
    365: 2000,
  } as Record<number, number>,
};

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { id: "python", name: "Python", extension: ".py" },
  { id: "javascript", name: "JavaScript", extension: ".js" },
  { id: "typescript", name: "TypeScript", extension: ".ts" },
  { id: "java", name: "Java", extension: ".java" },
  { id: "cpp", name: "C++", extension: ".cpp" },
  { id: "go", name: "Go", extension: ".go" },
] as const;

// Company Tags
export const COMPANIES = [
  "Google",
  "Meta",
  "Amazon",
  "Apple",
  "Netflix",
  "Microsoft",
  "Uber",
  "Airbnb",
  "LinkedIn",
  "Twitter",
] as const;

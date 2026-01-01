// Gamification Constants
// Level titles, learning phases, and achievement categories

// ============== LEVEL TITLES ==============
// 10 level titles from beginner to master
export const LEVEL_TITLES: Record<number, { title: string; emoji: string; description: string }> = {
  1: { title: "Curious Learner", emoji: "🌱", description: "Just starting your journey" },
  2: { title: "Code Explorer", emoji: "🔍", description: "Exploring the basics" },
  3: { title: "Pattern Seeker", emoji: "🧩", description: "Finding patterns everywhere" },
  4: { title: "Algorithm Apprentice", emoji: "📚", description: "Learning the fundamentals" },
  5: { title: "Data Structurer", emoji: "🏗️", description: "Building solid foundations" },
  6: { title: "Problem Solver", emoji: "💡", description: "Solving with confidence" },
  7: { title: "Code Warrior", emoji: "⚔️", description: "Battle-tested skills" },
  8: { title: "Algorithm Ninja", emoji: "🥷", description: "Swift and precise" },
  9: { title: "Tech Architect", emoji: "🏛️", description: "Designing elegant solutions" },
  10: { title: "AI Mastermind", emoji: "👑", description: "Master of all patterns" },
};

// Get level title for any level number
export function getLevelTitle(level: number): { title: string; emoji: string; description: string } {
  // Map level to the 1-10 title scale
  if (level <= 0) return LEVEL_TITLES[1];
  if (level >= 10) return LEVEL_TITLES[10];
  return LEVEL_TITLES[level] || LEVEL_TITLES[1];
}

// ============== LEARNING PHASES ==============
// 6 phases grouping the 15 DSA patterns
export interface LearningPhase {
  id: number;
  name: string;
  description: string;
  icon: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  patterns: string[];
  isPremium: boolean;
}

export const LEARNING_PHASES: LearningPhase[] = [
  {
    id: 1,
    name: "Foundation",
    description: "Build your base with essential concepts",
    icon: "Blocks",
    emoji: "🌱",
    color: "#8b5cf6",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    patterns: ["arrays-hashing"],
    isPremium: false,
  },
  {
    id: 2,
    name: "Traversal Mastery",
    description: "Master efficient data navigation",
    icon: "Route",
    emoji: "🎯",
    color: "#06b6d4",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    patterns: ["two-pointers", "sliding-window"],
    isPremium: false,
  },
  {
    id: 3,
    name: "Core Structures",
    description: "Essential data structures for any problem",
    icon: "Layers",
    emoji: "🏗️",
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    patterns: ["stack", "binary-search", "linked-list"],
    isPremium: false,
  },
  {
    id: 4,
    name: "Hierarchical Thinking",
    description: "Trees, tries, and priority structures",
    icon: "GitBranch",
    emoji: "🌲",
    color: "#10b981",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    patterns: ["trees", "tries", "heap-priority-queue"],
    isPremium: true,
  },
  {
    id: 5,
    name: "Advanced Techniques",
    description: "Complex algorithms and graph theory",
    icon: "Network",
    emoji: "🚀",
    color: "#ec4899",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    patterns: ["backtracking", "graphs"],
    isPremium: true,
  },
  {
    id: 6,
    name: "Optimization Masters",
    description: "Dynamic programming and greedy algorithms",
    icon: "Crown",
    emoji: "👑",
    color: "#f97316",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    patterns: ["dynamic-programming-1d", "dynamic-programming-2d", "greedy", "intervals"],
    isPremium: true,
  },
];

// Get phase by pattern slug
export function getPhaseByPattern(patternSlug: string): LearningPhase | undefined {
  return LEARNING_PHASES.find(phase => phase.patterns.includes(patternSlug));
}

// ============== ACHIEVEMENT CATEGORIES ==============
export interface AchievementCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ACHIEVEMENT_CATEGORIES: Record<string, AchievementCategory> = {
  streak: {
    id: "streak",
    name: "Consistency",
    icon: "Flame",
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  completion: {
    id: "completion",
    name: "Completion",
    icon: "CheckCircle2",
    color: "#10b981",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  mastery: {
    id: "mastery",
    name: "Mastery",
    icon: "GraduationCap",
    color: "#8b5cf6",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
  },
  speed: {
    id: "speed",
    name: "Speed",
    icon: "Zap",
    color: "#06b6d4",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  special: {
    id: "special",
    name: "Special",
    icon: "Star",
    color: "#ec4899",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
  },
  milestone: {
    id: "milestone",
    name: "Milestones",
    icon: "Trophy",
    color: "#f97316",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
};

// ============== GOAL PRIORITIES ==============
// How different onboarding goals affect learning recommendations
export interface GoalPriority {
  patterns: string[];
  pace: "intensive" | "moderate" | "steady" | "relaxed";
  dailyGoalSuggestion: number;
  description: string;
}

export const GOAL_PRIORITIES: Record<string, GoalPriority> = {
  career: {
    patterns: ["arrays-hashing", "two-pointers", "trees", "graphs", "dynamic-programming-1d"],
    pace: "intensive",
    dailyGoalSuggestion: 5,
    description: "Focus on FAANG-heavy patterns for interview success",
  },
  startup: {
    patterns: ["arrays-hashing", "stack", "graphs", "greedy"],
    pace: "moderate",
    dailyGoalSuggestion: 3,
    description: "Practical patterns for real-world problems",
  },
  upskill: {
    patterns: ["binary-search", "dynamic-programming-1d", "backtracking"],
    pace: "steady",
    dailyGoalSuggestion: 2,
    description: "Fill knowledge gaps systematically",
  },
  curious: {
    patterns: ["arrays-hashing", "backtracking", "trees"],
    pace: "relaxed",
    dailyGoalSuggestion: 1,
    description: "Explore at your own pace",
  },
};

// ============== STREAK MESSAGES ==============
export const STREAK_MESSAGES: Record<number, string> = {
  0: "Start your streak today!",
  1: "Great start! Day 1 complete!",
  2: "Two days strong! Keep going!",
  3: "Three days in a row! You're on fire!",
  5: "Five day streak! Incredible!",
  7: "One week streak! You're unstoppable!",
  14: "Two weeks! You're building a habit!",
  30: "Monthly master! 30 days strong!",
  60: "Two months! Absolutely amazing!",
  100: "Century club! 100 days!",
  365: "One year legend! Unbelievable dedication!",
};

export function getStreakMessage(streak: number): string {
  // Find the highest matching milestone
  const milestones = Object.keys(STREAK_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const milestone of milestones) {
    if (streak >= milestone) {
      return STREAK_MESSAGES[milestone];
    }
  }
  return STREAK_MESSAGES[0];
}

// ============== XP CALCULATIONS ==============
export function calculateXpForLevel(level: number): number {
  // XP required to reach the next level
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function calculateLevelFromXp(totalXp: number): { level: number; currentXp: number; xpForNextLevel: number } {
  let level = 1;
  let xpRemaining = totalXp;

  while (xpRemaining >= calculateXpForLevel(level)) {
    xpRemaining -= calculateXpForLevel(level);
    level++;
  }

  return {
    level,
    currentXp: xpRemaining,
    xpForNextLevel: calculateXpForLevel(level),
  };
}

// ============== CELEBRATION TYPES ==============
export type CelebrationType =
  | "achievement"
  | "level_up"
  | "streak_milestone"
  | "daily_goal"
  | "pattern_complete"
  | "first_solve";

export const CELEBRATION_MESSAGES: Record<CelebrationType, string> = {
  achievement: "Achievement Unlocked!",
  level_up: "Level Up!",
  streak_milestone: "Streak Milestone!",
  daily_goal: "Daily Goal Complete!",
  pattern_complete: "Pattern Mastered!",
  first_solve: "First Problem Solved!",
};

// ============== DAILY GOAL CONFIG ==============
export const DAILY_GOAL_OPTIONS = [
  { value: 1, label: "1 problem", description: "Casual pace" },
  { value: 2, label: "2 problems", description: "Steady progress" },
  { value: 3, label: "3 problems", description: "Recommended" },
  { value: 5, label: "5 problems", description: "Intensive" },
  { value: 10, label: "10 problems", description: "Challenge mode" },
];

// ============== TIME COMMITMENT OPTIONS ==============
export const TIME_COMMITMENT_OPTIONS = [
  { value: "15min", label: "15 min/day", description: "Quick daily practice" },
  { value: "30min", label: "30 min/day", description: "Balanced approach" },
  { value: "1hour", label: "1 hour/day", description: "Intensive learning" },
  { value: "weekends", label: "Weekends only", description: "Weekend warrior" },
];

// ============== EXPERIENCE LEVEL OPTIONS ==============
export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner", description: "New to DSA, learning basics" },
  { value: "intermediate", label: "Intermediate", description: "Know basics, building patterns" },
  { value: "advanced", label: "Advanced", description: "Experienced, optimizing skills" },
];

// ============== ONBOARDING GOAL OPTIONS ==============
export const ONBOARDING_GOAL_OPTIONS = [
  { value: "career", label: "Career", emoji: "💼", description: "Preparing for tech interviews" },
  { value: "startup", label: "Startup", emoji: "🚀", description: "Building products fast" },
  { value: "upskill", label: "Upskill", emoji: "📈", description: "Improving existing skills" },
  { value: "curious", label: "Curious", emoji: "🧠", description: "Learning for fun" },
];

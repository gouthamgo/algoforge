import { useQuery } from "wasp/client/operations";
import { getDashboardData } from "wasp/client/operations";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Target,
  ArrowRight,
  CheckCircle2,
  Play,
  ChevronRight,
  Layers,
  Flame,
  Hash,
  ArrowLeftRight,
  PanelLeftClose,
  Zap,
  Code2,
  Sparkles,
  Trophy,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";

// Type for pattern progress from API
interface PatternProgress {
  slug: string;
  title: string;
  order: number;
  solved: number;
  total: number;
}

// Pattern icons mapping
const patternIcons: Record<string, any> = {
  "arrays-hashing": Hash,
  "two-pointers": ArrowLeftRight,
  "sliding-window": PanelLeftClose,
  "stack": Layers,
};

// Pattern colors with enhanced gradients
const patternColors: Record<string, { bg: string; text: string; border: string; gradient: string; glow: string }> = {
  "arrays-hashing": {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/30",
    gradient: "from-violet-500 to-fuchsia-500",
    glow: "shadow-violet-500/20",
  },
  "two-pointers": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    gradient: "from-cyan-400 to-blue-500",
    glow: "shadow-cyan-500/20",
  },
  "sliding-window": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    gradient: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  "stack": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/20",
  },
};

// Circular progress component
function CircularProgress({ progress, size = 48, strokeWidth = 3, color = "violet" }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorMap: Record<string, string> = {
    violet: "#8b5cf6",
    cyan: "#22d3ee",
    emerald: "#34d399",
    amber: "#fbbf24",
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorMap[color]} />
            <stop offset="100%" stopColor={colorMap[color]} stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white font-mono">{progress}%</span>
      </div>
    </div>
  );
}

// Animated number counter
function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="font-mono tabular-nums">{displayValue}</span>;
}

// Glass card component
function GlassCard({ children, className = "", hover = true, glow = "" }: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: string;
}) {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl
      bg-gradient-to-br from-white/[0.08] to-white/[0.02]
      backdrop-blur-xl
      border border-white/[0.08]
      ${hover ? 'hover:border-white/[0.15] hover:from-white/[0.12] hover:to-white/[0.04]' : ''}
      transition-all duration-500 ease-out
      ${glow ? `shadow-2xl ${glow}` : ''}
      ${className}
    `}>
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

// Stat card with animated glow
function StatCard({ icon: Icon, label, value, suffix, description, color, delay }: {
  icon: any;
  label: string;
  value: number;
  suffix?: string;
  description: string;
  color: "emerald" | "violet" | "amber" | "cyan";
  delay: string;
}) {
  const colorStyles = {
    emerald: {
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      glow: "group-hover:shadow-emerald-500/10",
      border: "group-hover:border-emerald-500/30",
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    },
    violet: {
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400",
      glow: "group-hover:shadow-violet-500/10",
      border: "group-hover:border-violet-500/30",
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    },
    amber: {
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      glow: "group-hover:shadow-amber-500/10",
      border: "group-hover:border-amber-500/30",
      gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    },
    cyan: {
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
      glow: "group-hover:shadow-cyan-500/10",
      border: "group-hover:border-cyan-500/30",
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    },
  };

  const styles = colorStyles[color];

  return (
    <div
      className={`group animate-fade-up`}
      style={{ animationDelay: delay }}
    >
      <GlassCard className={`p-6 group-hover:shadow-2xl ${styles.glow} ${styles.border}`}>
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div className={`h-12 w-12 rounded-xl ${styles.iconBg} flex items-center justify-center
              group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-6 w-6 ${styles.iconColor}`} />
            </div>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-[0.2em]">{label}</span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-4xl font-bold text-white tracking-tight">
              <AnimatedNumber value={value} />
            </span>
            {suffix && (
              <span className="text-lg font-normal text-zinc-500">{suffix}</span>
            )}
          </div>

          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </GlassCard>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery(getDashboardData);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Animated loading spinner */}
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-2xl opacity-50 animate-pulse" />
            <div className="absolute -inset-4 rounded-3xl border border-violet-500/20 animate-ping opacity-30" />
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-sm font-medium mb-1">Loading your progress</p>
            <p className="text-zinc-600 text-xs font-mono">Syncing data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center">
        <GlassCard className="p-8 max-w-sm text-center">
          <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <Zap className="h-7 w-7 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-zinc-500 text-sm mb-5">Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }

  const { user, stats, recentActivity, nextProblems, patternProgress: dbPatternProgress } = data || {};
  const totalSolved = stats?.totalSolved || 0;
  const patternsInProgress = (dbPatternProgress as PatternProgress[] | undefined)?.filter((p) => p.solved > 0).length || 0;
  const currentStreak = stats?.streak || 0;
  const continueProblem = nextProblems?.[0];

  // Use real pattern progress from API
  const patternProgress: PatternProgress[] = (dbPatternProgress as PatternProgress[]) || [];

  return (
    <div className="min-h-screen bg-[#05050a] relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orb */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        {/* Secondary gradient orb */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        {/* Accent orb */}
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 60%)',
            animation: 'float 15s ease-in-out infinite',
          }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-12 animate-fade-up">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                {/* Status indicator */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                    Ready to practice
                  </span>
                </div>

                {/* Welcome message */}
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                  Welcome back
                  {user?.username && (
                    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400
                      bg-clip-text text-transparent">, {user.username}</span>
                  )}
                </h1>
                <p className="text-zinc-400 text-lg">
                  Pick up where you left off and keep building momentum
                </p>
              </div>

              {/* Quick action */}
              <div className="flex items-center gap-3">
                <Link
                  to="/problems"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                    text-white text-sm font-medium transition-all duration-300"
                >
                  <BookOpen className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                  Browse Problems
                </Link>
                <Link
                  to="/roadmap"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                    hover:from-violet-500 hover:to-fuchsia-500
                    text-white text-sm font-semibold transition-all duration-300
                    shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
                >
                  <Target className="h-4 w-4" />
                  View Roadmap
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <StatCard
              icon={CheckCircle2}
              label="Solved"
              value={totalSolved}
              description="problems completed"
              color="emerald"
              delay="0.1s"
            />
            <StatCard
              icon={Layers}
              label="Patterns"
              value={patternsInProgress}
              suffix="/4"
              description="patterns started"
              color="violet"
              delay="0.15s"
            />
            <StatCard
              icon={Flame}
              label="Streak"
              value={currentStreak}
              suffix=" days"
              description={currentStreak > 0 ? "keep the momentum!" : "start your streak today"}
              color="amber"
              delay="0.2s"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Continue Learning & Up Next */}
            <div className="lg:col-span-8 space-y-6">
              {/* Continue Learning Hero Card */}
              {continueProblem && (
                <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
                  <Link
                    to={`/problems/${continueProblem.slug}`}
                    className="group block relative overflow-hidden rounded-3xl"
                  >
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="h-full w-full rounded-3xl bg-[#0a0a12]" />
                    </div>

                    {/* Card content */}
                    <div className="relative m-[1px] rounded-3xl bg-gradient-to-br from-[#12121a] to-[#0a0a12] overflow-hidden">
                      {/* Animated background glow */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]
                        group-hover:bg-violet-500/20 transition-all duration-700" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px]
                        group-hover:bg-fuchsia-500/15 transition-all duration-700" />

                      <div className="relative p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                          <div className="flex-1">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                              bg-violet-500/10 border border-violet-500/20 mb-5">
                              <Play className="h-3.5 w-3.5 text-violet-400" />
                              <span className="text-violet-400 text-xs font-semibold uppercase tracking-wide">
                                Continue Learning
                              </span>
                            </div>

                            {/* Problem info */}
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2
                              group-hover:text-violet-200 transition-colors duration-300">
                              {continueProblem.title}
                            </h2>
                            <p className="text-zinc-500 text-lg mb-6">
                              {continueProblem.pattern?.title || "Arrays & Hashing"}
                            </p>

                            {/* Meta info */}
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-zinc-500">
                                <Code2 className="h-4 w-4" />
                                <span className="text-sm">Ready to solve</span>
                              </div>
                              <div className="flex items-center gap-2 text-zinc-500">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">~20 min</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-4">
                            {/* Difficulty badge */}
                            <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                              continueProblem.difficulty === "easy"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : continueProblem.difficulty === "medium"
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}>
                              {continueProblem.difficulty?.charAt(0).toUpperCase() + continueProblem.difficulty?.slice(1)}
                            </div>

                            {/* CTA button */}
                            <div className="flex items-center gap-2 px-6 py-3 rounded-xl
                              bg-gradient-to-r from-violet-600 to-fuchsia-600
                              text-white font-semibold shadow-lg shadow-violet-500/25
                              group-hover:shadow-violet-500/40 group-hover:gap-3 transition-all duration-300">
                              <span>Start Problem</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Up Next Section */}
              <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <GlassCard className="overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-cyan-400" />
                      </div>
                      <h3 className="font-semibold text-white">Up Next</h3>
                    </div>
                    <Link
                      to="/problems"
                      className="text-sm text-zinc-500 hover:text-white flex items-center gap-1
                        transition-colors group"
                    >
                      View all
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="divide-y divide-white/5">
                    {nextProblems?.slice(1, 5).map((problem: any) => {
                      const difficulty = problem.difficulty?.toLowerCase() || "easy";
                      return (
                        <Link
                          key={problem.id}
                          to={`/problems/${problem.slug}`}
                          className="flex items-center justify-between px-6 py-4
                            hover:bg-white/[0.02] transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`h-2.5 w-2.5 rounded-full ring-4 ring-opacity-20 ${
                              difficulty === "easy"
                                ? "bg-emerald-400 ring-emerald-400"
                                : difficulty === "medium"
                                ? "bg-amber-400 ring-amber-400"
                                : "bg-red-400 ring-red-400"
                            }`} />
                            <div>
                              <p className="font-medium text-zinc-300 group-hover:text-white
                                transition-colors">
                                {problem.title}
                              </p>
                              <p className="text-sm text-zinc-600">
                                {problem.pattern?.title || "Arrays & Hashing"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-700
                            group-hover:text-zinc-400 group-hover:translate-x-0.5
                            transition-all duration-300" />
                        </Link>
                      );
                    })}
                    {(!nextProblems || nextProblems.length <= 1) && (
                      <div className="px-6 py-10 text-center">
                        <Sparkles className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500">All caught up! Check the roadmap for more.</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Right Column - Pattern Progress & Recent Activity */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pattern Progress */}
              <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
                <GlassCard className="overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Layers className="h-4 w-4 text-violet-400" />
                      </div>
                      <h3 className="font-semibold text-white">Pattern Progress</h3>
                    </div>
                    <Link
                      to="/roadmap"
                      className="text-xs text-zinc-500 hover:text-white flex items-center gap-1
                        transition-colors group"
                    >
                      Roadmap
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="p-4 space-y-2">
                    {patternProgress.map((pattern) => {
                      const colors = patternColors[pattern.slug] || patternColors["arrays-hashing"];
                      const Icon = patternIcons[pattern.slug] || Hash;
                      const progress = pattern.total > 0 ? Math.round((pattern.solved / pattern.total) * 100) : 0;
                      const colorKey = pattern.slug.includes("arrays") ? "violet" :
                                       pattern.slug.includes("two") ? "cyan" :
                                       pattern.slug.includes("sliding") ? "emerald" : "amber";

                      return (
                        <Link
                          key={pattern.slug}
                          to={`/problems?pattern=${pattern.slug}`}
                          className="group flex items-center gap-4 p-4 rounded-xl
                            bg-white/[0.02] hover:bg-white/[0.05]
                            border border-transparent hover:border-white/[0.05]
                            transition-all duration-300"
                        >
                          {/* Circular progress */}
                          <CircularProgress progress={progress} size={48} color={colorKey} />

                          {/* Pattern info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`h-5 w-5 rounded ${colors.bg} flex items-center justify-center`}>
                                <Icon className={`h-3 w-3 ${colors.text}`} />
                              </div>
                              <p className="font-medium text-zinc-300 group-hover:text-white
                                transition-colors truncate text-sm">
                                {pattern.title}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-600 font-mono">
                              {pattern.solved} of {pattern.total} solved
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-zinc-700
                            group-hover:text-zinc-400 transition-colors shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>

              {/* Quick Actions */}
              <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div className="space-y-3">
                  <Link
                    to="/roadmap"
                    className="group flex items-center gap-4 p-5 rounded-2xl
                      bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5
                      border border-violet-500/20 hover:border-violet-500/40
                      transition-all duration-300"
                  >
                    <div className="h-11 w-11 rounded-xl bg-violet-500/20 flex items-center justify-center
                      group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-violet-200 transition-colors">
                        Learning Roadmap
                      </p>
                      <p className="text-sm text-zinc-500">Master 15 core patterns</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-violet-500
                      group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to="/problems"
                    className="group flex items-center gap-4 p-5 rounded-2xl
                      bg-gradient-to-br from-cyan-500/10 to-blue-500/5
                      border border-cyan-500/20 hover:border-cyan-500/40
                      transition-all duration-300"
                  >
                    <div className="h-11 w-11 rounded-xl bg-cyan-500/20 flex items-center justify-center
                      group-hover:scale-110 transition-transform duration-300">
                      <Code2 className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                        All Problems
                      </p>
                      <p className="text-sm text-zinc-500">Browse full collection</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-cyan-500
                      group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              {recentActivity && recentActivity.length > 0 && (
                <div className="animate-fade-up" style={{ animationDelay: '0.45s' }}>
                  <GlassCard className="overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-white">Recent Solves</h3>
                    </div>

                    <div className="p-4 space-y-1">
                      {recentActivity.slice(0, 4).map((activity: any) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-400 truncate">
                              {activity.problem?.title}
                            </p>
                          </div>
                          <span className="text-[11px] text-zinc-600 font-mono shrink-0">
                            {new Date(activity.solvedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}

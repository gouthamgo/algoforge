import { useQuery } from "wasp/client/operations";
import { getDashboardData } from "wasp/client/operations";
import { Link } from "react-router-dom";
import {
  Target,
  ArrowRight,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Circle,
  Play,
  ChevronRight,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery(getDashboardData);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center">
        <p className="text-red-400">Error loading dashboard</p>
      </div>
    );
  }

  const { user, stats, recentActivity, nextProblems } = data || {};
  const totalSolved = stats?.totalSolved || 0;

  return (
    <div className="min-h-screen bg-[#07070a]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back{user?.username ? `, ${user.username}` : ""}
            </h1>
            <p className="text-zinc-500 mt-1">
              Continue your journey to mastering algorithms
            </p>
          </div>

          {/* Stats Row - Simple */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Problems Solved */}
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Problems Solved
              </div>
              <div className="text-3xl font-bold text-white">
                {totalSolved}
              </div>
            </div>

            {/* Patterns Started */}
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                <Target className="h-4 w-4 text-violet-400" />
                Patterns
              </div>
              <div className="text-3xl font-bold text-white">
                1<span className="text-lg font-normal text-zinc-500">/15</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Next Problems */}
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Play className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Start Practicing</h2>
                    <p className="text-xs text-zinc-500">Available problems</p>
                  </div>
                </div>
                <Link
                  to="/problems"
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  All problems <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="p-4">
                {nextProblems && nextProblems.length > 0 ? (
                  <div className="space-y-2">
                    {nextProblems.map((problem: any) => {
                      const difficulty = problem.difficulty?.toLowerCase() || "easy";
                      return (
                        <Link
                          key={problem.id}
                          to={`/problems/${problem.slug}`}
                          className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/60 border border-transparent hover:border-violet-500/20 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`h-2 w-2 rounded-full ${
                              difficulty === "easy" ? "bg-emerald-400" :
                              difficulty === "medium" ? "bg-amber-400" :
                              "bg-red-400"
                            }`} />
                            <div>
                              <p className="font-medium text-white group-hover:text-violet-300 transition-colors">
                                {problem.title}
                              </p>
                              <p className="text-sm text-zinc-500">
                                {problem.pattern?.title || "Arrays & Hashing"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                              difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </span>
                            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 mb-2">No problems available yet</p>
                    <p className="text-sm text-zinc-600 mb-4">Check back soon for new problems!</p>
                    <Link
                      to="/roadmap"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors text-sm"
                    >
                      <Layers className="h-4 w-4" />
                      View Roadmap
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity - Only show if there's real activity */}
            {recentActivity && recentActivity.length > 0 && (
              <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-zinc-500" />
                    <h3 className="font-semibold text-white">Recent Activity</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity: any) => {
                      const difficulty = activity.problem?.difficulty?.toLowerCase() || "easy";
                      return (
                        <div key={activity.id} className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${
                            difficulty === "easy" ? "bg-emerald-400" :
                            difficulty === "medium" ? "bg-amber-400" :
                            "bg-red-400"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-300 truncate">
                              {activity.problem?.title}
                            </p>
                            <p className="text-xs text-zinc-600">
                              {new Date(activity.solvedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links - Only Roadmap since that's what matters */}
            <div className="flex gap-4">
              <Link
                to="/roadmap"
                className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-violet-300 transition-colors">
                    Learning Roadmap
                  </p>
                  <p className="text-sm text-zinc-500">15 core patterns</p>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-600 ml-auto group-hover:text-violet-400 transition-colors" />
              </Link>

              <Link
                to="/problems"
                className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                    Problem Bank
                  </p>
                  <p className="text-sm text-zinc-500">Practice problems</p>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-600 ml-auto group-hover:text-cyan-400 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

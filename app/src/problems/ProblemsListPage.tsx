import { useState } from "react";
import { useQuery } from "wasp/client/operations";
import { getProblems } from "wasp/client/operations";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DIFFICULTY_CONFIG, COMPANIES } from "../shared/constants";

export default function ProblemsListPage() {
  const [filters, setFilters] = useState({
    difficulty: "",
    status: "",
    company: "",
    search: "",
    page: 1,
  });

  const { data, isLoading, error } = useQuery(getProblems, filters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Error loading problems</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Problem Bank</h1>
          <p className="text-muted-foreground mt-1">
            Practice problems organized by pattern and difficulty
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search problems..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="attempted">Attempted</option>
              <option value="solved">Solved</option>
            </select>

            {/* Company Filter */}
            <select
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
              className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Companies</option>
              {COMPANIES.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : data?.problems && data.problems.length > 0 ? (
            <>
              <div className="divide-y divide-border">
                {data.problems.map((problem: any) => {
                  const diffConfig = DIFFICULTY_CONFIG[problem.difficulty as keyof typeof DIFFICULTY_CONFIG];
                  const isSolved = problem.status === "solved";
                  const isAttempted = problem.status === "attempted";

                  return (
                    <Link
                      key={problem.id}
                      to={`/problems/${problem.slug}`}
                      className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Status Icon */}
                        {isSolved ? (
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                        ) : isAttempted ? (
                          <Clock className="h-5 w-5 text-warning flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}

                        {/* Problem Info */}
                        <div>
                          <h3 className="font-medium text-foreground">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {problem.pattern?.title}
                            </span>
                            {problem.companies && problem.companies.length > 0 && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <div className="flex items-center gap-1">
                                  {problem.companies.slice(0, 2).map((c: any) => (
                                    <span
                                      key={c.companyName}
                                      className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded"
                                    >
                                      {c.companyName}
                                    </span>
                                  ))}
                                  {problem.companies.length > 2 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{problem.companies.length - 2}
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diffConfig?.bgColor} ${diffConfig?.color} border ${diffConfig?.borderColor}`}
                        >
                          {diffConfig?.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          +{problem.xpReward} XP
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {data.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                      disabled={data.pagination.page <= 1}
                      className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                      disabled={data.pagination.page >= data.pagination.totalPages}
                      className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No problems found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

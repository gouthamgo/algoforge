import { useQuery } from "wasp/client/operations";
import { getPattern } from "wasp/client/operations";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Clock, Lightbulb } from "lucide-react";
import { DIFFICULTY_CONFIG } from "../shared/constants";

export default function PatternPage() {
  const { topicSlug, patternSlug } = useParams<{ topicSlug: string; patternSlug: string }>();
  const { data: pattern, isLoading, error } = useQuery(getPattern, {
    topicSlug: topicSlug || "",
    patternSlug: patternSlug || "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Pattern not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          to={`/roadmap/${topicSlug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {pattern.topic?.title}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{pattern.topic?.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{pattern.title}</h1>
          <p className="text-muted-foreground mt-2">{pattern.description}</p>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-md">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${pattern.progress}%` }}
              />
            </div>
            <span className="text-sm text-foreground font-medium">
              {pattern.solvedCount}/{pattern.problems?.length || 0} solved
            </span>
          </div>
        </div>

        {/* Pattern Explanation Card */}
        {pattern.explanation && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-warning" />
              <h2 className="text-lg font-semibold text-foreground">
                When to use this pattern
              </h2>
            </div>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p>{pattern.explanation}</p>
            </div>
          </div>
        )}

        {/* Problems Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Problems</h2>
          </div>

          <div className="divide-y divide-border">
            {pattern.problems?.map((problem: any) => {
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
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : isAttempted ? (
                      <Clock className="h-5 w-5 text-warning" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}

                    {/* Problem Info */}
                    <div>
                      <h3 className="font-medium text-foreground">{problem.title}</h3>
                      {problem.companies && problem.companies.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {problem.companies.slice(0, 3).map((c: any) => (
                            <span
                              key={c.companyName}
                              className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded"
                            >
                              {c.companyName}
                            </span>
                          ))}
                          {problem.companies.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{problem.companies.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Difficulty Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diffConfig?.bgColor} ${diffConfig?.color} border ${diffConfig?.borderColor}`}
                    >
                      {diffConfig?.label}
                    </span>

                    {/* Hints Used */}
                    {problem.hintsUsed > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {problem.hintsUsed} hints
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

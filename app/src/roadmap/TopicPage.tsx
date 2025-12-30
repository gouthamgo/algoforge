import { useQuery } from "wasp/client/operations";
import { getTopic } from "wasp/client/operations";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { DIFFICULTY_CONFIG } from "../shared/constants";

export default function TopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const { data: topic, isLoading, error } = useQuery(getTopic, { topicSlug: topicSlug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Topic not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          to="/roadmap"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roadmap
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{topic.title}</h1>
          <p className="text-muted-foreground mt-2">{topic.description}</p>
        </div>

        {/* Patterns List */}
        <div className="space-y-6">
          {topic.patterns?.map((pattern: any, index: number) => (
            <div
              key={pattern.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Pattern Header */}
              <Link
                to={`/roadmap/${topicSlug}/${pattern.slug}`}
                className="flex items-center justify-between p-6 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {pattern.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pattern.solvedCount}/{pattern.problems?.length || 0} problems solved
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Progress Ring */}
                  <div className="relative h-12 w-12">
                    <svg className="h-12 w-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-secondary"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={`${pattern.progress * 1.26} 126`}
                        className="text-primary"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                      {pattern.progress}%
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>

              {/* Problems Preview */}
              {pattern.problems && pattern.problems.length > 0 && (
                <div className="border-t border-border p-4 bg-secondary/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {pattern.problems.slice(0, 6).map((problem: any) => {
                      const diffConfig = DIFFICULTY_CONFIG[problem.difficulty as keyof typeof DIFFICULTY_CONFIG];
                      const isSolved = problem.status === "solved";

                      return (
                        <Link
                          key={problem.id}
                          to={`/problems/${problem.slug}`}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          {isSolved ? (
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="text-sm text-foreground truncate">
                            {problem.title}
                          </span>
                          <span
                            className={`ml-auto px-1.5 py-0.5 rounded text-xs ${diffConfig?.bgColor} ${diffConfig?.color}`}
                          >
                            {diffConfig?.label?.[0]}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  {pattern.problems.length > 6 && (
                    <Link
                      to={`/roadmap/${topicSlug}/${pattern.slug}`}
                      className="block text-center text-sm text-primary hover:text-primary/80 mt-3"
                    >
                      View all {pattern.problems.length} problems
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

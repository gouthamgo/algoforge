import { useQuery } from "wasp/client/operations";
import { getProblems } from "wasp/client/operations";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, Clock, Building2 } from "lucide-react";
import { DIFFICULTY_CONFIG } from "../shared/constants";

export default function CompanyProblemsPage() {
  const { company } = useParams<{ company: string }>();
  const { data, isLoading, error } = useQuery(getProblems, { company: company || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        {/* Breadcrumb */}
        <Link
          to="/problems"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{company}</h1>
            <p className="text-muted-foreground mt-1">
              {data?.problems?.length || 0} problems frequently asked at {company}
            </p>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {data?.problems && data.problems.length > 0 ? (
            <div className="divide-y divide-border">
              {data.problems.map((problem: any) => {
                const diffConfig = DIFFICULTY_CONFIG[problem.difficulty as keyof typeof DIFFICULTY_CONFIG];
                const isSolved = problem.status === "solved";
                const isAttempted = problem.status === "attempted";
                const companyData = problem.companies?.find((c: any) => c.companyName === company);

                return (
                  <Link
                    key={problem.id}
                    to={`/problems/${problem.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {isSolved ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : isAttempted ? (
                        <Clock className="h-5 w-5 text-warning" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <h3 className="font-medium text-foreground">{problem.title}</h3>
                        <p className="text-sm text-muted-foreground">{problem.pattern?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {companyData?.frequency && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${
                                i < companyData.frequency ? "bg-primary" : "bg-secondary"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diffConfig?.bgColor} ${diffConfig?.color}`}
                      >
                        {diffConfig?.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No problems found for {company}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

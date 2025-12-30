import { useState } from "react";
import { useQuery, useAction } from "wasp/client/operations";
import { getReviewQueue, completeReview } from "wasp/client/operations";
import { Link } from "react-router-dom";
import { RotateCcw, CheckCircle, XCircle, Sparkles, Brain, ArrowRight } from "lucide-react";
import { DIFFICULTY_CONFIG } from "../shared/constants";

export default function ReviewPage() {
  const { data: reviewItems, isLoading, error, refetch } = useQuery(getReviewQueue);
  const completeReviewAction = useAction(completeReview);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (quality: number) => {
    if (!reviewItems || currentIndex >= reviewItems.length) return;

    setIsSubmitting(true);
    try {
      await completeReviewAction({
        problemId: reviewItems[currentIndex].problemId,
        quality,
      });

      setShowAnswer(false);
      if (currentIndex < reviewItems.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        refetch();
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <p className="text-destructive">Error loading review queue</p>
      </div>
    );
  }

  const currentItem = reviewItems?.[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Spaced Review
            </h1>
            <p className="text-muted-foreground mt-1">
              Strengthen your memory with spaced repetition
            </p>
          </div>
          {reviewItems && reviewItems.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} / {reviewItems.length}
            </div>
          )}
        </div>

        {!reviewItems || reviewItems.length === 0 ? (
          /* No Reviews */
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Sparkles className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              All caught up!
            </h2>
            <p className="text-muted-foreground mb-6">
              No problems to review right now. Keep solving new problems!
            </p>
            <Link
              to="/problems"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue Learning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : currentItem ? (
          /* Review Card */
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Problem Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    DIFFICULTY_CONFIG[currentItem.problem.difficulty as keyof typeof DIFFICULTY_CONFIG]?.bgColor
                  } ${
                    DIFFICULTY_CONFIG[currentItem.problem.difficulty as keyof typeof DIFFICULTY_CONFIG]?.color
                  }`}
                >
                  {DIFFICULTY_CONFIG[currentItem.problem.difficulty as keyof typeof DIFFICULTY_CONFIG]?.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {currentItem.problem.pattern?.title}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {currentItem.problem.title}
              </h2>
            </div>

            {/* Prompt */}
            <div className="p-6">
              <p className="text-lg text-foreground mb-6">
                Can you solve this problem? Think about the approach before revealing the answer.
              </p>

              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors font-medium"
                >
                  Show Problem
                </button>
              ) : (
                <>
                  <div className="mb-6">
                    <Link
                      to={`/problems/${currentItem.problem.slug}`}
                      className="text-primary hover:text-primary/80 underline"
                    >
                      Open full problem
                    </Link>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    How well did you remember the solution?
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleReview(1)}
                      disabled={isSubmitting}
                      className="flex flex-col items-center gap-2 p-4 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-8 w-8 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Again</span>
                      <span className="text-xs text-muted-foreground">Didn't remember</span>
                    </button>

                    <button
                      onClick={() => handleReview(3)}
                      disabled={isSubmitting}
                      className="flex flex-col items-center gap-2 p-4 bg-warning/10 hover:bg-warning/20 border border-warning/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="h-8 w-8 text-warning" />
                      <span className="text-sm font-medium text-warning">Hard</span>
                      <span className="text-xs text-muted-foreground">With difficulty</span>
                    </button>

                    <button
                      onClick={() => handleReview(5)}
                      disabled={isSubmitting}
                      className="flex flex-col items-center gap-2 p-4 bg-success/10 hover:bg-success/20 border border-success/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-8 w-8 text-success" />
                      <span className="text-sm font-medium text-success">Easy</span>
                      <span className="text-xs text-muted-foreground">Remembered well</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* Progress Bar */}
        {reviewItems && reviewItems.length > 0 && (
          <div className="mt-6">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentIndex) / reviewItems.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

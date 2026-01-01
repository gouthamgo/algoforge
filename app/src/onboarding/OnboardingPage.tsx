import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "wasp/client/operations";
import { getOnboardingStatus, completeOnboarding } from "wasp/client/operations";
import { Terminal } from "lucide-react";

import { WelcomeStep } from "./steps/WelcomeStep";
import { GoalStep } from "./steps/GoalStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { TimeCommitmentStep } from "./steps/TimeCommitmentStep";
import { RecommendationStep } from "./steps/RecommendationStep";

type Step = "welcome" | "goal" | "experience" | "time" | "recommendation";

const STEPS: Step[] = ["welcome", "goal", "experience", "time", "recommendation"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { data: onboardingStatus, isLoading } = useQuery(getOnboardingStatus);

  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [formData, setFormData] = useState({
    goal: null as string | null,
    experienceLevel: null as string | null,
    timeCommitment: null as string | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already onboarded
  useEffect(() => {
    if (onboardingStatus?.hasCompletedOnboarding) {
      navigate("/dashboard");
    }
  }, [onboardingStatus, navigate]);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleComplete = async () => {
    if (!formData.goal || !formData.experienceLevel || !formData.timeCommitment) {
      return;
    }

    setIsSubmitting(true);
    try {
      await completeOnboarding({
        goal: formData.goal,
        experienceLevel: formData.experienceLevel,
        timeCommitment: formData.timeCommitment,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 animate-pulse flex items-center justify-center">
            <Terminal className="h-8 w-8 text-white" />
          </div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6">
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Terminal className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Algo<span className="text-violet-400">Forge</span>
            </span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="px-4 sm:px-6 mb-4">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500">Step {currentStepIndex + 1} of {STEPS.length}</span>
              <span className="text-xs text-zinc-500">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step indicators */}
            <div className="flex items-center justify-between mt-3">
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`
                    h-2 w-2 rounded-full transition-all duration-300
                    ${i <= currentStepIndex
                      ? "bg-violet-500 scale-100"
                      : "bg-zinc-700 scale-75"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {currentStep === "welcome" && (
              <WelcomeStep
                userName={onboardingStatus?.displayName || onboardingStatus?.username}
                onNext={goToNextStep}
              />
            )}

            {currentStep === "goal" && (
              <GoalStep
                selectedGoal={formData.goal}
                onSelect={(goal) => setFormData((prev) => ({ ...prev, goal }))}
                onNext={goToNextStep}
                onBack={goToPrevStep}
              />
            )}

            {currentStep === "experience" && (
              <ExperienceStep
                selectedLevel={formData.experienceLevel}
                onSelect={(level) => setFormData((prev) => ({ ...prev, experienceLevel: level }))}
                onNext={goToNextStep}
                onBack={goToPrevStep}
              />
            )}

            {currentStep === "time" && (
              <TimeCommitmentStep
                selectedTime={formData.timeCommitment}
                onSelect={(time) => setFormData((prev) => ({ ...prev, timeCommitment: time }))}
                onNext={goToNextStep}
                onBack={goToPrevStep}
              />
            )}

            {currentStep === "recommendation" && formData.goal && formData.experienceLevel && formData.timeCommitment && (
              <RecommendationStep
                goal={formData.goal}
                experienceLevel={formData.experienceLevel}
                timeCommitment={formData.timeCommitment}
                onComplete={handleComplete}
                onBack={goToPrevStep}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center">
          <p className="text-xs text-zinc-600">
            You can always change your preferences later in settings
          </p>
        </footer>
      </div>
    </div>
  );
}

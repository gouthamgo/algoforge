import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { ONBOARDING_GOAL_OPTIONS } from "../../gamification/constants";

interface GoalStepProps {
  selectedGoal: string | null;
  onSelect: (goal: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GoalStep({ selectedGoal, onSelect, onNext, onBack }: GoalStepProps) {
  return (
    <div className="flex flex-col px-4 py-6 animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          What's your main goal?
        </h2>
        <p className="text-zinc-400">
          This helps us personalize your learning path
        </p>
      </div>

      {/* Goal options */}
      <div className="grid gap-3 mb-8 max-w-lg mx-auto w-full">
        {ONBOARDING_GOAL_OPTIONS.map((option) => {
          const isSelected = selectedGoal === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`
                relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left
                transition-all duration-300
                ${isSelected
                  ? "bg-violet-500/10 border-violet-500 shadow-lg shadow-violet-500/20"
                  : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                }
              `}
            >
              {/* Emoji */}
              <span className="text-3xl">{option.emoji}</span>

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">{option.label}</h3>
                <p className="text-sm text-zinc-400">{option.description}</p>
              </div>

              {/* Check indicator */}
              <div
                className={`
                  h-6 w-6 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isSelected
                    ? "bg-violet-500 text-white scale-100"
                    : "bg-white/10 scale-90 opacity-50"
                  }
                `}
              >
                {isSelected && <Check className="h-4 w-4" />}
              </div>

              {/* Selection ring effect */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-violet-500/50 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!selectedGoal}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            transition-all duration-300
            ${selectedGoal
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:gap-3"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }
          `}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default GoalStep;

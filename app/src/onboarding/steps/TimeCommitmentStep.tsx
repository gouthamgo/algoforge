import { ArrowRight, ArrowLeft, Check, Clock } from "lucide-react";
import { TIME_COMMITMENT_OPTIONS } from "../../gamification/constants";

interface TimeCommitmentStepProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const timeIcons: Record<string, string> = {
  "15min": "⚡",
  "30min": "⏰",
  "1hour": "🎯",
  weekends: "📅",
};

export function TimeCommitmentStep({ selectedTime, onSelect, onNext, onBack }: TimeCommitmentStepProps) {
  return (
    <div className="flex flex-col px-4 py-6 animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          How much time can you dedicate?
        </h2>
        <p className="text-zinc-400">
          We'll set realistic daily goals for you
        </p>
      </div>

      {/* Time options */}
      <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto w-full">
        {TIME_COMMITMENT_OPTIONS.map((option) => {
          const isSelected = selectedTime === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`
                relative flex flex-col items-center p-5 rounded-2xl border-2 text-center
                transition-all duration-300
                ${isSelected
                  ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20"
                  : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                }
              `}
            >
              {/* Emoji */}
              <span className="text-3xl mb-2">{timeIcons[option.value]}</span>

              {/* Text */}
              <h3 className="font-semibold text-white text-lg mb-1">{option.label}</h3>
              <p className="text-xs text-zinc-400">{option.description}</p>

              {/* Check indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
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
          disabled={!selectedTime}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            transition-all duration-300
            ${selectedTime
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:gap-3"
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

export default TimeCommitmentStep;

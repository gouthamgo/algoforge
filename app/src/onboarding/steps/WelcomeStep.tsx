import { Sparkles, ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  userName?: string | null;
  onNext: () => void;
}

export function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-8 animate-fade-up">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-500/30">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        {/* Floating rings */}
        <div className="absolute inset-0 rounded-3xl border-2 border-violet-500/30 animate-ping" />
        <div className="absolute -inset-2 rounded-3xl border border-violet-500/20 animate-pulse" />
      </div>

      {/* Welcome text */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
        Welcome{userName ? `, ${userName}` : ""}!
      </h1>
      <p className="text-lg text-zinc-400 mb-8 max-w-md">
        Let's personalize your learning experience. This will only take a minute.
      </p>

      {/* Features preview */}
      <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
        {[
          { label: "Personalized Path", icon: "🎯" },
          { label: "Track Progress", icon: "📈" },
          { label: "Earn Rewards", icon: "🏆" },
        ].map((feature) => (
          <div
            key={feature.label}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <span className="text-2xl mb-2 block">{feature.icon}</span>
            <span className="text-xs text-zinc-400">{feature.label}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onNext}
        className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-lg shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:gap-3"
      >
        Let's Get Started
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.6s ease-out; }
      `}</style>
    </div>
  );
}

export default WelcomeStep;

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Star } from "lucide-react";

interface XPRevealProps {
  xpAmount: number;
  bonusXp?: number;
  bonusLabel?: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function XPReveal({
  xpAmount,
  bonusXp = 0,
  bonusLabel = "Bonus",
  onComplete,
  autoStart = true,
}: XPRevealProps) {
  const [phase, setPhase] = useState<"hidden" | "base" | "bonus" | "total">("hidden");
  const [displayXp, setDisplayXp] = useState(0);
  const totalXp = xpAmount + bonusXp;

  useEffect(() => {
    if (!autoStart) return;

    // Start animation sequence
    const timeline = [
      { phase: "base" as const, delay: 300 },
      { phase: "bonus" as const, delay: 1500 },
      { phase: "total" as const, delay: 2500 },
    ];

    const timeouts = timeline.map(({ phase, delay }) =>
      setTimeout(() => setPhase(phase), delay)
    );

    // Animate number counting
    const countTimeout = setTimeout(() => {
      let current = 0;
      const increment = Math.ceil(totalXp / 30);
      const interval = setInterval(() => {
        current = Math.min(current + increment, totalXp);
        setDisplayXp(current);
        if (current >= totalXp) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 1000);
        }
      }, 50);
    }, 2500);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(countTimeout);
    };
  }, [autoStart, totalXp, onComplete]);

  return (
    <div className="relative flex flex-col items-center py-6">
      {/* Animated glow background */}
      <div
        className={`
          absolute inset-0 rounded-3xl transition-all duration-1000
          ${phase !== "hidden" ? "opacity-100" : "opacity-0"}
        `}
        style={{
          background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
        }}
      />

      {/* Main XP display */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon */}
        <div
          className={`
            h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500
            flex items-center justify-center mb-4
            transition-all duration-500
            ${phase !== "hidden" ? "scale-100 opacity-100" : "scale-50 opacity-0"}
          `}
        >
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        {/* Base XP */}
        <div
          className={`
            flex items-center gap-2 mb-2 transition-all duration-500
            ${phase !== "hidden" ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          <span className="text-lg text-zinc-400">Earned</span>
          <span className="text-2xl font-bold text-violet-400">+{xpAmount}</span>
          <span className="text-lg text-zinc-400">XP</span>
        </div>

        {/* Bonus XP */}
        {bonusXp > 0 && (
          <div
            className={`
              flex items-center gap-2 mb-4 transition-all duration-500 delay-200
              ${phase === "bonus" || phase === "total"
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-90"
              }
            `}
          >
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">{bonusLabel}</span>
            <span className="text-lg font-bold text-amber-400">+{bonusXp}</span>
            <span className="text-sm text-amber-400">XP</span>
          </div>
        )}

        {/* Divider */}
        <div
          className={`
            w-32 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-4
            transition-all duration-500
            ${phase === "total" ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Total */}
        <div
          className={`
            flex flex-col items-center transition-all duration-700
            ${phase === "total"
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-75"
            }
          `}
        >
          <span className="text-sm text-zinc-500 uppercase tracking-wider mb-1">Total</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-violet-400" />
            <span className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              +{displayXp}
            </span>
            <span className="text-xl text-zinc-400">XP</span>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      {phase === "total" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-up"
              style={{
                left: `${10 + i * 12}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <Sparkles className="h-4 w-4 text-violet-400/50" />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% {
            bottom: 0;
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
          100% {
            bottom: 100%;
            opacity: 0;
            transform: translateX(20px) rotate(180deg);
          }
        }
        .animate-float-up {
          animation: float-up 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

// Compact XP badge for inline display
export function XPBadge({ amount, variant = "default" }: { amount: number; variant?: "default" | "success" | "bonus" }) {
  const variants = {
    default: "bg-violet-500/10 border-violet-500/30 text-violet-400",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    bonus: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border ${variants[variant]}`}>
      <Sparkles className="h-3 w-3" />
      <span className="text-sm font-semibold">+{amount} XP</span>
    </div>
  );
}

export default XPReveal;

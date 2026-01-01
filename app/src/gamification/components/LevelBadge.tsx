import { getLevelTitle, LEVEL_TITLES } from "../constants";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
}

// Color progression from green (beginner) to gold (master)
const LEVEL_COLORS: Record<number, { bg: string; border: string; text: string; glow: string }> = {
  1: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  2: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400", glow: "shadow-teal-500/20" },
  3: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
  4: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
  5: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-violet-500/20" },
  6: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
  7: { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30", text: "text-fuchsia-400", glow: "shadow-fuchsia-500/20" },
  8: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", glow: "shadow-pink-500/20" },
  9: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", glow: "shadow-orange-500/20" },
  10: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
};

function getLevelColor(level: number) {
  if (level <= 0) return LEVEL_COLORS[1];
  if (level >= 10) return LEVEL_COLORS[10];
  return LEVEL_COLORS[level] || LEVEL_COLORS[1];
}

const sizeClasses = {
  sm: {
    container: "px-2 py-1",
    emoji: "text-base",
    level: "text-xs",
    title: "text-[10px]",
    description: "text-[9px]",
  },
  md: {
    container: "px-3 py-1.5",
    emoji: "text-xl",
    level: "text-sm",
    title: "text-xs",
    description: "text-[10px]",
  },
  lg: {
    container: "px-4 py-2",
    emoji: "text-2xl",
    level: "text-base",
    title: "text-sm",
    description: "text-xs",
  },
};

export function LevelBadge({
  level,
  size = "md",
  showTitle = true,
  showDescription = false,
  className = "",
}: LevelBadgeProps) {
  const levelInfo = getLevelTitle(level);
  const colors = getLevelColor(level);
  const sizes = sizeClasses[size];

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-xl border
        ${colors.bg} ${colors.border}
        ${sizes.container}
        shadow-lg ${colors.glow}
        transition-all duration-300 hover:scale-105
        ${className}
      `}
    >
      {/* Emoji */}
      <span className={sizes.emoji}>{levelInfo.emoji}</span>

      {/* Text content */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${colors.text} ${sizes.level}`}>
            Lv.{level}
          </span>
          {showTitle && (
            <span className={`font-medium text-zinc-300 ${sizes.title}`}>
              {levelInfo.title}
            </span>
          )}
        </div>
        {showDescription && (
          <span className={`text-zinc-500 ${sizes.description}`}>
            {levelInfo.description}
          </span>
        )}
      </div>
    </div>
  );
}

// Compact badge for headers
export function LevelBadgeCompact({ level }: { level: number }) {
  const levelInfo = getLevelTitle(level);
  const colors = getLevelColor(level);

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border
        ${colors.bg} ${colors.border}
        transition-all duration-300 hover:scale-105
      `}
      title={`Level ${level}: ${levelInfo.title}`}
    >
      <span className="text-sm">{levelInfo.emoji}</span>
      <span className={`text-xs font-bold ${colors.text}`}>{level}</span>
    </div>
  );
}

// All levels display (for profile or settings)
export function AllLevelsBadges({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(LEVEL_TITLES).map(([lvl, info]) => {
        const level = parseInt(lvl);
        const isUnlocked = currentLevel >= level;
        const isCurrent = currentLevel === level;

        return (
          <div
            key={level}
            className={`
              relative flex flex-col items-center p-3 rounded-xl border
              transition-all duration-300
              ${isUnlocked
                ? `${getLevelColor(level).bg} ${getLevelColor(level).border}`
                : "bg-zinc-900/50 border-zinc-800/50 opacity-50"
              }
              ${isCurrent ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0a0a0f]" : ""}
            `}
          >
            <span className={`text-2xl ${!isUnlocked ? "grayscale" : ""}`}>
              {info.emoji}
            </span>
            <span className={`text-xs font-bold mt-1 ${isUnlocked ? "text-white" : "text-zinc-600"}`}>
              Lv.{level}
            </span>
            <span className={`text-[10px] text-center mt-0.5 ${isUnlocked ? "text-zinc-400" : "text-zinc-600"}`}>
              {info.title}
            </span>
            {isCurrent && (
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-violet-500 border-2 border-[#0a0a0f]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LevelBadge;

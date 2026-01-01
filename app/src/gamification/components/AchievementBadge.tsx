import { Lock, Sparkles, Star, Trophy, Flame, CheckCircle2, Zap, GraduationCap } from "lucide-react";
import { ACHIEVEMENT_CATEGORIES } from "../constants";

interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  iconEmoji?: string | null;
  xpReward: number;
  category: string;
  rarity: string;
  isUnlocked?: boolean;
  unlockedAt?: Date;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  onClick?: () => void;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  Star,
  Trophy,
  Flame,
  CheckCircle2,
  Zap,
  GraduationCap,
  Sparkles,
};

// Rarity colors
const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: {
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    text: "text-zinc-400",
    glow: "",
  },
  rare: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  epic: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-purple-500/30",
  },
  legendary: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/40",
  },
};

const sizeClasses = {
  sm: {
    container: "p-2",
    icon: "h-6 w-6",
    iconContainer: "h-10 w-10",
    title: "text-xs",
    description: "text-[10px]",
    xp: "text-[10px]",
  },
  md: {
    container: "p-3",
    icon: "h-8 w-8",
    iconContainer: "h-14 w-14",
    title: "text-sm",
    description: "text-xs",
    xp: "text-xs",
  },
  lg: {
    container: "p-4",
    icon: "h-10 w-10",
    iconContainer: "h-18 w-18",
    title: "text-base",
    description: "text-sm",
    xp: "text-sm",
  },
};

export function AchievementBadge({
  achievement,
  size = "md",
  showDetails = true,
  onClick,
}: AchievementBadgeProps) {
  const { isUnlocked = false } = achievement;
  const rarity = rarityColors[achievement.rarity] || rarityColors.common;
  const sizes = sizeClasses[size];
  const IconComponent = iconMap[achievement.iconName] || Star;

  return (
    <div
      className={`
        relative group rounded-xl border transition-all duration-300
        ${isUnlocked ? rarity.bg : "bg-zinc-900/50"}
        ${isUnlocked ? rarity.border : "border-zinc-800/50"}
        ${isUnlocked && rarity.glow ? `shadow-lg ${rarity.glow}` : ""}
        ${onClick ? "cursor-pointer hover:scale-105" : ""}
        ${sizes.container}
      `}
      onClick={onClick}
    >
      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-900/80 z-10">
          <Lock className="h-5 w-5 text-zinc-600" />
        </div>
      )}

      <div className={`flex flex-col items-center text-center ${!isUnlocked ? "opacity-40" : ""}`}>
        {/* Icon */}
        <div
          className={`
            ${sizes.iconContainer} rounded-xl flex items-center justify-center mb-2
            ${isUnlocked ? rarity.bg : "bg-zinc-800/50"}
          `}
        >
          {achievement.iconEmoji ? (
            <span className={sizes.icon}>{achievement.iconEmoji}</span>
          ) : (
            <IconComponent className={`${sizes.icon} ${isUnlocked ? rarity.text : "text-zinc-600"}`} />
          )}
        </div>

        {showDetails && (
          <>
            {/* Title */}
            <h4 className={`font-semibold text-white mb-1 ${sizes.title}`}>
              {achievement.title}
            </h4>

            {/* Description */}
            <p className={`text-zinc-500 mb-2 line-clamp-2 ${sizes.description}`}>
              {achievement.description}
            </p>

            {/* XP Reward */}
            <div className={`flex items-center gap-1 ${sizes.xp}`}>
              <Sparkles className={`h-3 w-3 ${isUnlocked ? "text-violet-400" : "text-zinc-600"}`} />
              <span className={isUnlocked ? "text-violet-400" : "text-zinc-600"}>
                +{achievement.xpReward} XP
              </span>
            </div>

            {/* Rarity badge */}
            <div
              className={`
                mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
                ${rarity.bg} ${rarity.text}
              `}
            >
              {achievement.rarity}
            </div>
          </>
        )}
      </div>

      {/* Unlock date */}
      {isUnlocked && achievement.unlockedAt && showDetails && (
        <div className="absolute top-1 right-1">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </div>
  );
}

// Grid of achievements
export function AchievementGrid({
  achievements,
  columns = 4,
  size = "sm",
}: {
  achievements: Achievement[];
  columns?: 2 | 3 | 4 | 5;
  size?: "sm" | "md";
}) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3`}>
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size={size}
        />
      ))}
    </div>
  );
}

// Showcase of recent/featured achievements
export function BadgeShowcase({
  unlocked,
  nextUp,
  totalUnlocked,
  totalAvailable,
}: {
  unlocked: Achievement[];
  nextUp: Achievement[];
  totalUnlocked: number;
  totalAvailable: number;
}) {
  const recentUnlocked = unlocked.slice(0, 3);

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Achievements</h3>
            <p className="text-xs text-zinc-500">
              {totalUnlocked} of {totalAvailable} unlocked
            </p>
          </div>
        </div>
        <a
          href="/achievements"
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          View all
        </a>
      </div>

      {/* Recent achievements */}
      {recentUnlocked.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-zinc-500 mb-2">Recently unlocked</p>
          <div className="flex gap-2">
            {recentUnlocked.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="sm"
                showDetails={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Up next */}
      {nextUp.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-2">Up next</p>
          <div className="space-y-2">
            {nextUp.slice(0, 2).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30"
              >
                <div className="h-8 w-8 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                  {achievement.iconEmoji ? (
                    <span className="text-base opacity-50">{achievement.iconEmoji}</span>
                  ) : (
                    <Lock className="h-4 w-4 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-400 truncate">
                    {achievement.title}
                  </p>
                  <p className="text-[10px] text-zinc-600 truncate">
                    {achievement.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                  <Sparkles className="h-3 w-3" />
                  +{achievement.xpReward}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AchievementBadge;

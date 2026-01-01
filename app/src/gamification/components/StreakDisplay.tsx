import { Flame, Calendar, TrendingUp } from "lucide-react";
import { getStreakMessage } from "../constants";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date | null;
  compact?: boolean;
  showWeekCalendar?: boolean;
}

// Get the last 7 days with activity status
function getWeekDays(lastActiveDate: Date | null, currentStreak: number): { day: string; isActive: boolean; isToday: boolean }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: { day: string; isActive: boolean; isToday: boolean }[] = [];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const isToday = i === 0;
    let isActive = false;

    // Calculate if this day was active based on streak
    if (lastActiveDate) {
      const lastActive = new Date(lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      // If within streak range and not in the future
      if (daysDiff < currentStreak && date <= lastActive) {
        isActive = true;
      }
      // Today is active if lastActiveDate is today
      if (isToday && lastActive.getTime() === today.getTime()) {
        isActive = true;
      }
    }

    days.push({
      day: dayNames[date.getDay()],
      isActive,
      isToday,
    });
  }

  return days;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  lastActiveDate,
  compact = false,
  showWeekCalendar = true,
}: StreakDisplayProps) {
  const message = getStreakMessage(currentStreak);
  const weekDays = getWeekDays(lastActiveDate || null, currentStreak);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-lg border
            ${currentStreak > 0
              ? "bg-orange-500/10 border-orange-500/30"
              : "bg-zinc-800/50 border-zinc-700/50"
            }
          `}
        >
          <Flame className={`h-3.5 w-3.5 ${currentStreak > 0 ? "text-orange-400" : "text-zinc-500"}`} />
          <span className={`text-sm font-semibold ${currentStreak > 0 ? "text-orange-300" : "text-zinc-400"}`}>
            {currentStreak}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        p-5 rounded-2xl border transition-all duration-500
        ${currentStreak > 0
          ? "bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/30"
          : "bg-zinc-900/50 border-zinc-800/50"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              h-10 w-10 rounded-xl flex items-center justify-center
              ${currentStreak > 0 ? "bg-orange-500/20" : "bg-zinc-800/50"}
            `}
          >
            <Flame className={`h-5 w-5 ${currentStreak > 0 ? "text-orange-400" : "text-zinc-500"}`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Current Streak</h3>
            <p className="text-xs text-zinc-500">{message}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-3xl font-bold ${currentStreak > 0 ? "text-orange-400" : "text-zinc-500"}`}>
            {currentStreak}
          </span>
          <span className="text-zinc-500 text-sm ml-1">days</span>
        </div>
      </div>

      {/* Week calendar */}
      {showWeekCalendar && (
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500">This week</span>
          </div>
          <div className="flex items-center gap-1.5">
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2 rounded-lg
                  transition-all duration-300
                  ${day.isToday ? "ring-2 ring-violet-500/50 ring-offset-1 ring-offset-transparent" : ""}
                `}
              >
                <span className="text-[10px] text-zinc-600 uppercase">{day.day}</span>
                <div
                  className={`
                    h-6 w-6 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${day.isActive
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
                      : "bg-zinc-800/50"
                    }
                  `}
                >
                  {day.isActive && (
                    <Flame className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-zinc-500" />
          <span className="text-zinc-500">Longest</span>
        </div>
        <span className="text-sm font-semibold text-zinc-300">
          {longestStreak} days
        </span>
      </div>
    </div>
  );
}

// Streak badge for headers
export function StreakBadge({ streak }: { streak: number }) {
  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-lg border
        transition-all duration-300 hover:scale-105
        ${streak > 0
          ? "bg-orange-500/10 border-orange-500/30"
          : "bg-zinc-800/50 border-zinc-700/50"
        }
      `}
      title={`${streak} day streak`}
    >
      <Flame className={`h-3.5 w-3.5 ${streak > 0 ? "text-orange-400 animate-pulse" : "text-zinc-500"}`} />
      <span className={`text-xs font-bold ${streak > 0 ? "text-orange-400" : "text-zinc-500"}`}>
        {streak}
      </span>
    </div>
  );
}

export default StreakDisplay;

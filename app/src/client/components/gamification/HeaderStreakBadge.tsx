import { useQuery } from "wasp/client/operations";
import { getHeaderStats } from "wasp/client/operations";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

export function HeaderStreakBadge() {
  const { data, isLoading } = useQuery(getHeaderStats);

  if (isLoading || !data) {
    return (
      <div className="h-8 w-12 rounded-lg bg-zinc-800/50 animate-pulse" />
    );
  }

  const hasStreak = data.currentStreak > 0;

  return (
    <Link
      to="/profile"
      className={`
        group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200
        ${hasStreak
          ? "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40"
          : "bg-zinc-800/30 border-zinc-700/30 hover:border-zinc-600/50"
        }
      `}
      title={`${data.currentStreak} day streak`}
    >
      <Flame
        className={`h-3.5 w-3.5 transition-colors ${
          hasStreak ? "text-orange-400" : "text-zinc-500"
        } ${hasStreak ? "animate-pulse" : ""}`}
      />
      <span
        className={`text-xs font-semibold ${
          hasStreak ? "text-orange-300" : "text-zinc-500"
        }`}
      >
        {data.currentStreak}
      </span>
    </Link>
  );
}

export default HeaderStreakBadge;

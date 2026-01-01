import { useQuery } from "wasp/client/operations";
import { getHeaderStats } from "wasp/client/operations";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HeaderXPBadge() {
  const { data, isLoading } = useQuery(getHeaderStats);

  if (isLoading || !data) {
    return (
      <div className="h-8 w-20 rounded-lg bg-zinc-800/50 animate-pulse" />
    );
  }

  return (
    <Link
      to="/profile"
      className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-200"
      title={`Level ${data.level}: ${data.levelTitle}`}
    >
      {/* Level emoji */}
      <span className="text-sm">{data.levelEmoji}</span>

      {/* XP */}
      <div className="flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-violet-400" />
        <span className="text-xs font-semibold text-violet-300">
          {data.totalXp.toLocaleString()}
        </span>
      </div>

      {/* Mini progress bar */}
      <div className="hidden sm:block w-12 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-500"
          style={{ width: `${data.xpProgress}%` }}
        />
      </div>
    </Link>
  );
}

export default HeaderXPBadge;

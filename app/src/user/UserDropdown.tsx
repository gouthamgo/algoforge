import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { logout } from "wasp/client/auth";
import { Link as WaspRouterLink } from "wasp/client/router";
import { type User as UserEntity } from "wasp/entities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../client/components/ui/dropdown-menu";
import { userMenuItems } from "./constants";

export function UserDropdown({ user }: { user: Partial<UserEntity> }) {
  const [open, setOpen] = useState(false);

  // Get initials for avatar
  const initials = (user.username || "U").slice(0, 2).toUpperCase();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
          <span className="hidden text-right text-sm font-medium lg:block max-w-[100px] truncate">
            {user.username}
          </span>
          <ChevronDown className="size-3.5 text-zinc-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {userMenuItems.map((item) => {
          if (item.isAuthRequired && !user) return null;
          if (item.isAdminOnly && (!user || !user.isAdmin)) return null;

          return (
            <DropdownMenuItem key={item.name}>
              <WaspRouterLink
                to={item.to}
                onClick={() => {
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3"
              >
                <item.icon size="1.1rem" />
                {item.name}
              </WaspRouterLink>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem>
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3"
          >
            <LogOut size="1.1rem" />
            Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

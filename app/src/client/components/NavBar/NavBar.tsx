import { LogIn, Menu, Terminal, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { UserDropdown } from "../../../user/UserDropdown";
import { cn } from "../../utils";

export interface NavigationItem {
  name: string;
  to: string;
}

export default function NavBar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0a0a0f]/95 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            to={user ? routes.DashboardRoute.to : routes.LandingPageRoute.to}
            className="flex items-center gap-2.5 group"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-all">
              <Terminal className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">
              Algo<span className="text-violet-400">Forge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.to ||
                (item.to !== "/" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  target={item.to.startsWith("http") ? "_blank" : undefined}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
                    isActive
                      ? "text-white bg-violet-500/10 text-violet-300"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isUserLoading ? null : !user ? (
              <>
                <Link
                  to={routes.LoginRoute.to}
                  className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to={routes.SignupRoute.to}
                  className="px-4 py-1.5 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <UserDropdown user={user} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0a0a0f]">
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  target={item.to.startsWith("http") ? "_blank" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 text-sm rounded-lg transition-colors",
                    isActive
                      ? "text-violet-300 bg-violet-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-zinc-800 mt-2">
              {isUserLoading ? null : !user ? (
                <div className="space-y-2">
                  <Link
                    to={routes.LoginRoute.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to={routes.SignupRoute.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm bg-violet-600 text-white rounded-lg text-center"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="px-1">
                  <UserDropdown user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

import { useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { useQuery } from "wasp/client/operations";
import { getOnboardingStatus } from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Toaster } from "../client/components/ui/toaster";
import "./Main.css";
import NavBar from "./components/NavBar/NavBar";
import {
  demoNavigationitems,
  marketingNavigationItems,
} from "./components/NavBar/constants";
import CookieConsentBanner from "./components/cookie-consent/Banner";

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const { data: onboardingStatus } = useQuery(getOnboardingStatus, undefined, {
    enabled: !!user,
  });

  const isMarketingPage = useMemo(() => {
    return (
      location.pathname === "/" || location.pathname.startsWith("/pricing")
    );
  }, [location]);

  const navigationItems = isMarketingPage
    ? marketingNavigationItems
    : demoNavigationitems;

  const shouldDisplayAppNavBar = useMemo(() => {
    return (
      location.pathname !== routes.LandingPageRoute.build() &&
      location.pathname !== routes.LoginRoute.build() &&
      location.pathname !== routes.SignupRoute.build()
    );
  }, [location]);

  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith("/admin");
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (user && onboardingStatus && !onboardingStatus.hasCompletedOnboarding) {
      // Don't redirect if already on onboarding page or auth pages
      const excludedPaths = ["/onboarding", "/login", "/signup", "/"];
      const isExcluded = excludedPaths.some(
        (path) => location.pathname === path || location.pathname.startsWith("/celebrate")
      );
      if (!isExcluded) {
        navigate("/onboarding");
      }
    }
  }, [user, onboardingStatus, location.pathname, navigate]);

  return (
    <>
      <div className="min-h-screen bg-[#07070a] text-white">
        {isAdminDashboard ? (
          <Outlet />
        ) : (
          <>
            {shouldDisplayAppNavBar && (
              <NavBar navigationItems={navigationItems} />
            )}
            <Outlet />
          </>
        )}
      </div>
      <Toaster position="bottom-right" />
      <CookieConsentBanner />
    </>
  );
}

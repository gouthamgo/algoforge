import { routes } from "wasp/client/router";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Roadmap", to: routes.RoadmapRoute.to },
  { name: "Problems", to: routes.ProblemsRoute.to },
  { name: "Pricing", to: routes.PricingPageRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Dashboard", to: routes.DashboardRoute.to },
  { name: "Roadmap", to: routes.RoadmapRoute.to },
  { name: "Problems", to: routes.ProblemsRoute.to },
  { name: "Review", to: routes.ReviewRoute.to },
] as const;

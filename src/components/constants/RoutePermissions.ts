import { routePath } from "./RoutePath";
import { commonLabels } from "./Common";

// Routes accessible only to customers
export const customerRoutes: string[] = [
  routePath.dashboard,
  routePath.myProjects,
  routePath.messages,
  routePath.profile
];

// Routes accessible only to professional
export const professionalRoutes: string[] = [
  routePath.projects,
  routePath.messages,
  routePath.myOffers,
  routePath.subscription,
  routePath.profile
];

// Get all allowed routes for a specific role
export const getAllowedRoutes = (role: string | null): string[] => {
  if (!role) return [];

  if (role === commonLabels.customerRole) {
    return customerRoutes;
  }

  if (role === commonLabels.businessRole) {
    return professionalRoutes;
  }

  return [];
};

export const isRouteAllowedForRole = (
  pathname: string,
  role: string | null
): boolean => {
  if (!role) return false;

  if (pathname === routePath.accessDenied) return true;

  const allowedRoutes = getAllowedRoutes(role);

  return allowedRoutes.some((route) => {
    if (pathname === route) return true;
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
};

export interface HeaderNavItem {
  path: string;
  translationKey: string;
}

export const customerHeaderNavItems: HeaderNavItem[] = [
  {
    path: routePath.dashboard,
    translationKey: "sidebarConstants.dashboard",
  },
  {
    path: routePath.myProjects,
    translationKey: "sidebarConstants.myProjects",
  },
  {
    path: routePath.messages,
    translationKey: "sidebarConstants.messages",
  },
];

export const professionalHeaderNavItems: HeaderNavItem[] = [
  {
    path: routePath.projects,
    translationKey: "sidebarConstants.projects",
  },
  {
    path: routePath.messages,
    translationKey: "sidebarConstants.messages",
  },
  {
    path: routePath.myOffers,
    translationKey: "sidebarConstants.myOffers",
  },
];

export const getHeaderNavItems = (role: string | null): HeaderNavItem[] => {
  if (!role) return [];

  let items: HeaderNavItem[] = [];

  if (role === commonLabels.customerRole) {
    items = customerHeaderNavItems;
  } else if (role === commonLabels.businessRole) {
    items = professionalHeaderNavItems;
  }

  return items.filter((item) => isRouteAllowedForRole(item.path, role));
};

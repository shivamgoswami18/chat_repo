import { routePath } from "@/components/constants/RoutePath";

export const publicRoutes = [routePath.logIn, routePath.home];

export const privateRoutes = [routePath.dashboard];

export const getDefaultPublicRoute = (): string => {
  return routePath.home;
};

export const isPublicRoute = (path: string): boolean => {
  return publicRoutes.includes(path);
};

export const isPrivateRoute = (path: string): boolean => {
  return privateRoutes.includes(path);
};

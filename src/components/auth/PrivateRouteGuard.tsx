"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getItem, commonLabels } from "@/components/constants/Common";
import { getDefaultPublicRoute } from "@/lib/config/routesConfig";
import { useAppSelector } from "@/lib/store/hooks";
import { isRouteAllowedForRole } from "@/components/constants/RoutePermissions";
import { routePath } from "../constants/RoutePath";

interface PrivateRouteGuardProps {
  readonly children: React.ReactNode;
}

export default function PrivateRouteGuard({
  children,
}: PrivateRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const role = useAppSelector((state) => state.auth.role);

  useEffect(() => {
    setMounted(true);
    const token = getItem(commonLabels.token);

    if (!token) {
      setIsAuthorized(false);
      router.replace(getDefaultPublicRoute());
      return;
    }

    if (role && !isRouteAllowedForRole(pathname, role)) {
      setIsAuthorized(false);
      router.replace(routePath.accessDenied);
      return;
    }

    setIsAuthorized(true);
  }, [router, pathname, role]);

  if (!mounted) {
    return <>{children}</>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

"use client";

import { usePathname } from "next/navigation";
import DashboardHeader from "./DashboardHeader";
import { routePath } from "@/components/constants/RoutePath";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isMessagesRoute = pathname === routePath.messages;

  return (
    <div className=" bg-mintUltraLight">
      <DashboardHeader />
      <div
        className={`max-w-container mx-auto ${
          isMessagesRoute
            ? "md:px-[80px] desktop:px-[124px] md:py-[18px] h-[calc(100vh-60px)] md:h-[calc(100vh-80px)]"
            : "px-[10px] xxs:px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[124px] py-[10px] xxs:py-[18px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

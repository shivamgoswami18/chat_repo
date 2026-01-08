"use client";

import React, { useState } from "react";
import { classNames } from "primereact/utils";
import BaseButton from "../base/BaseButton";
import { BackArrowIcon } from "@/assets/icons/CommonIcons";
import { useRouter, useSearchParams } from "next/navigation";
import { getTranslationSync } from "@/i18n/i18n";
import { routePath } from "../constants/RoutePath";

export interface ProfileTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
}

export interface BaseProfileTabProps {
  items: ProfileTabItem[];
  defaultActiveId?: string;
  onTabChange?: (itemId: string) => void;
  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;
}

export const ProfileTab: React.FC<BaseProfileTabProps> = ({
  items,
  defaultActiveId,
  onTabChange,
  className = "",
  sidebarClassName = "",
  contentClassName = "",
}) => {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [activeId, setActiveId] = useState(() => {
    if (tabFromUrl === "settings") {
      const settingsTab = items.find((item) =>
        item.id.toLowerCase().includes(routePath.settings)
      );
      return settingsTab?.id || defaultActiveId || items[0]?.id || "";
    }

    return defaultActiveId || items[0]?.id || "";
  });
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  const handleTabClick = (itemId: string) => {
    setActiveId(itemId);
    onTabChange?.(itemId);
  };
  const router = useRouter();

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className="w-full h-full">
      <div className="pb-[20px]">
        <BaseButton
          onClick={() => router.back()}
          startIcon={<BackArrowIcon className="h-[24px] w-[24px]" />}
          className="flex bg-mintUltraLight text-obsidianBlack border-0 text-titleMid items-center gap-[10px] hover:bg-mintUltraLight"
        >
          <span className="font-light xl:leading-[100%] xl:tracking-[0px] text-titleMid">
            {t("sidebarConstants.myProfile")}
          </span>
        </BaseButton>
      </div>

      <div
        className={classNames(
          "flex flex-1 overflow-hidden flex-col lg:flex-row gap-[20px] md:gap-[30px] lg:gap-[46px]",
          className
        )}
      >
        <div
          className={classNames(
            "w-full lg:w-[280px] bg-whitePrimary rounded-[16px]",
            sidebarClassName
          )}
        >
          <nav className="py-4">
            <ul className="space-y-1 list-none p-0 m-0">
              {items.map((item) => (
                <li key={item.id}>
                  <BaseButton
                    onClick={() => handleTabClick(item.id)}
                    className={classNames(
                      "w-full inline-flex items-start !justify-start text-start px-[30px] py-[16px] gap-3 border-0 rounded-none transition-all",
                      activeId === item.id
                        ? "bg-deepTeal bg-opacity-5 text-deepTeal font-medium border-l-4 border-deepTeal"
                        : "text-obsidianBlack bg-whitePrimary hover:bg-deepTeal hover:bg-opacity-5"
                    )}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span className="text-textSm font-light xl:leading-[100%] xl:tracking-[0.3px] space-y-[1px]">{item.label}</span>
                  </BaseButton>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className={classNames(
            "flex-1 w-full ",
            contentClassName
          )}
        >
          {activeItem?.component}
        </div>
      </div>
    </div>
  );
};

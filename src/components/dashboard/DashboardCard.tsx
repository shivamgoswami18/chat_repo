"use client";

import { getTranslationSync } from "@/i18n/i18n";
import {
  FrontArrowIcon,
  PostProjectPlusIcon,
} from "@/assets/icons/CommonIcons";
import { useRouter } from "next/navigation";
import { routePath } from "@/components/constants/RoutePath";
import BaseButton from "../base/BaseButton";

export default function DashboardCard() {
  const router = useRouter();
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  return (
    <div>
      <div className="bg-white p-3">
        <div className="p-4 font-normal text-textLg leading-none tracking-normal">
          {t("dashboardHeaderPageConstants.quickActions")}
        </div>
        <BaseButton
          onClick={() => router.push(routePath.createProjectSelectService)}
          className="flex flex-row w-full items-center justify-between p-2 bg-mintUltraLight cursor-pointer rounded-[10px] mb-3 border-0"
        >
          <div className="flex flex-row ">
            <div className="bg-whitePrimary p-3 rounded-[10px] mx-2 my-auto">
              <PostProjectPlusIcon />
            </div>
            <div className="px-2 pt-1">
              <div className="text-left text-textBase text-obsidianBlack">
                {t("dashboardHeaderPageConstants.postProject")}
              </div>
              <div className="text-left text-textSm text-obsidianBlack text-opacity-50">
                {t("dashboardHeaderPageConstants.startNewProject")}
              </div>
            </div>
          </div>
          <div className="p-3 mx-2">
            <FrontArrowIcon />
          </div>
        </BaseButton>
        <BaseButton
          onClick={() => router.push(routePath.messages)}
          className="flex flex-row w-full items-center justify-between p-2 bg-mintUltraLight cursor-pointer rounded-[10px] mb-3 border-0 "
        >
          <div className="flex flex-row ">
            <div className="bg-whitePrimary p-3 rounded-[10px] mx-2 my-auto">
              <PostProjectPlusIcon />
            </div>
            <div className="px-2 pt-1">
              <div className="text-left text-textBase text-obsidianBlack">
                {t("dashboardHeaderPageConstants.viewMessages")}
              </div>
              <div className="text-left text-textSm text-obsidianBlack text-opacity-50">
                {t("dashboardHeaderPageConstants.chatWithProfessionals")}
              </div>
            </div>
          </div>
          <div className="p-3 mx-2">
            <FrontArrowIcon />
          </div>
        </BaseButton>
        <BaseButton
          onClick={() => router.push(routePath.myProjects)}
          className="flex flex-row w-full items-center justify-between p-2 bg-mintUltraLight cursor-pointer rounded-[10px] mb-3 border-0"
        >
          <div className="flex flex-row ">
            <div className="bg-whitePrimary p-3 rounded-[10px] mx-2 my-auto">
              <PostProjectPlusIcon />
            </div>
            <div className="px-2 pt-1">
              <div className="text-left text-textBase text-obsidianBlack">
                {t("dashboardHeaderPageConstants.manageProjects")}
              </div>
              <div className="text-left text-textSm text-obsidianBlack text-opacity-50">
                {t("dashboardHeaderPageConstants.viewAllYourProjects")}
              </div>
            </div>
          </div>
          <div className="p-3 mx-2">
            <FrontArrowIcon />
          </div>
        </BaseButton>
      </div>
      <div className="leading-[30px] p-4">
        <div className="text-obsidianBlack text-opacity-70 text-textBase font-normal">
          {t("dashboardHeaderPageConstants.allRightsReserved")}
        </div>
        <div className="text-obsidianBlack text-opacity-70 text-textBase font-normal">
          {t("dashboardHeaderPageConstants.termsOfService")}
        </div>
      </div>
    </div>
  );
}

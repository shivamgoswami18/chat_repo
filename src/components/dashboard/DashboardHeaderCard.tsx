"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store/store";
import {
  DashboardHeaderBagIcon,
  DashboardHeaderCompletedIcon,
  DashboardHeaderInProgressIcon,
  DashboardHeaderStarIcon,
} from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import { DashboardStats } from "@/lib/api/DashboardApi";
import BaseLoader from "../base/BaseLoader";

function DashboardHeaderCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loadingStats } = useSelector(
    (state: RootState) => state.dashboard
  );

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  useEffect(() => {
    dispatch(DashboardStats());
  }, [dispatch]);

  const dashboardHeaderCardConst = [
    {
      icon: <DashboardHeaderBagIcon />,
      title: t("dashboardHeaderPageConstants.headerCardTitleActiveProjects"),
      value: stats?.active_projects,
    },
    {
      icon: <DashboardHeaderStarIcon />,
      title: t("dashboardHeaderPageConstants.headerCardTitleTotalOffers"),
      value: stats?.total_offers,
    },
    {
      icon: <DashboardHeaderInProgressIcon />,
      title: t("dashboardHeaderPageConstants.headerCardTitleInProgress"),
      value: stats?.progress_projects,
    },
    {
      icon: <DashboardHeaderCompletedIcon />,
      title: t("dashboardHeaderPageConstants.headerCardTitleCompleted"),
      value: stats?.completed_projects,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
      {dashboardHeaderCardConst?.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-3 rounded-2xl bg-white px-5 py-5 rounded-[16px] shadow-sm text-center"
        >
          <div className="flex rounded-custom items-center justify-center p-[15px] bg-mintUltraLight">
            {item?.icon}
          </div>

          <div className="space-y-[2px]">
            <p className="text-base font-light text-charcoalGrey opacity-70">
              {item?.title}
            </p>
            <p className="text-2xl font-semibold text-obsidianBlack">
              {loadingStats ? (
                <BaseLoader size="md" color="text-deepTeal" />
              ) : (
                item?.value
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardHeaderCard;

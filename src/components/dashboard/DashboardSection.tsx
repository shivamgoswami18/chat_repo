"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store/store";
import { CreateProjectPlusIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "@/components/base/BaseButton";
import BaseLoader from "@/components/base/BaseLoader";
import AddProjectIllustration from "@/assets/images/dashboard_add_icon.png";
import Image from "next/image";
import { getTranslationSync } from "@/i18n/i18n";
import ProjectCard from "../project/ProjectCard";
import { routePath } from "../constants/RoutePath";
import { useRouter } from "next/navigation";
import { ListOfActiveProject } from "@/lib/api/DashboardApi";
import { formatTimestamp } from "../constants/Common";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const DashboardSection = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { activeProjects, loadingActiveProjects } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(
      ListOfActiveProject({
        payload: {
          page: 1,
          limit: 10,
          sortKey: "createdAt",
          sortValue: "desc",
        },
      })
    );
  }, [dispatch]);

  const customerProjects = activeProjects?.items || [];

  const renderDashboardContent = () => {
    if (loadingActiveProjects) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center p-5">
          <BaseLoader size="xl" color="text-deepTeal" />
        </div>
      );
    }

    if (customerProjects.length > 0) {
      return (
        <div className="p-[24px]">
          {customerProjects?.map((project) => (
            <ProjectCard
              key={project?._id}
              title={project?.title || ""}
              category={project?.category?.name || ""}
              description={project?.description || ""}
              location={project?.county?.name || ""}
              timestamp={formatTimestamp(project?.createdAt)}
              status={project?.status || ""}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <Image
            src={AddProjectIllustration}
            alt={t("dashboardCardConstants.dashboardNoProjectImageAlt")}
          />

          <BaseButton
            startIcon={<CreateProjectPlusIcon />}
            onClick={() =>
              router.push(routePath.createProjectSelectService)
            }
            className="absolute left-1/2 bottom-0 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-deepTeal p-0 focus:ring-0 xl:leading-[100%] xl:tracking-[0px]"
          />
        </div>

        <p className="text-xl text-obsidianBlack opacity-50 xl:leading-[100%] xl:tracking-[0px]">
          {t("dashboardCardConstants.dashboardCardNoActiveProject")}
        </p>

        <BaseButton
          startIcon={<CreateProjectPlusIcon />}
          className="px-[17px] py-[10px] rounded-lg bg-deepTeal text-sm focus:ring-0 xl:leading-[100%] xl:tracking-[0px]"
          label={t("dashboardCardConstants.dashboardNewProjectButtonText")}
          onClick={() =>
            router.push(routePath.createProjectSelectService)
          }
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-[16px] bg-white shadow-[0px_0px_32px_0px_rgba(16,138,0,0.1)]]">
        <div className="flex items-center justify-between gap-4 border-b border-graySoft border-opacity-40 p-5">
          <div className="text-xl font-light text-obsidianBlack">
            {t("dashboardHeaderPageConstants.headerCardTitleActiveProjects")}
          </div>
        </div>

        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default DashboardSection;

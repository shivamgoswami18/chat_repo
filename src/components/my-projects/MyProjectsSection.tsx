"use client";

import { useState, useEffect } from "react";
import BaseTabs from "@/components/base/BaseTab";
import {
  commonLabels,
  formatDistanceToNowClean,
} from "@/components/constants/Common";
import { getTranslationSync } from "@/i18n/i18n";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import BaseButton from "../base/BaseButton";
import ProjectCard from "../project/ProjectCard";
import { ProjectCardProps } from "@/types/project";
import BaseLoader from "../base/BaseLoader";
import PaginationInfo from "../common/PaginationInfo";
import ProjectDetailsModal from "../project/ProjectDetailsModal";
import {
  ListOfMyProjectBusiness,
  ListOfMyProjectCustomer,
  ListOfProjectPayload,
} from "@/lib/api/ProjectApi";

export default function MyProjectsSection() {
  const t = (key: string) => getTranslationSync?.(key);
  const dispatch = useAppDispatch();
  const role = useAppSelector((state: RootState) => state.auth.role);
  const businessProjectItems = useAppSelector(
    (state: RootState) => state?.project?.myProjectsBusiness?.items ?? []
  );
  const businessTotalCount = useAppSelector(
    (state: RootState) => state?.project?.myProjectsBusiness?.totalCount ?? 0
  );
  const customerProjectItems = useAppSelector(
    (state: RootState) => state?.project?.myProjectsCustomer?.items ?? []
  );
  const customerTotalCount = useAppSelector(
    (state: RootState) => state?.project?.myProjectsCustomer?.totalCount ?? 0
  );
  const isLoading = useAppSelector(
    (state: RootState) => state?.auth?.loading ?? false
  );

  const isBusinessUI = role === commonLabels?.businessRole;
  const isCustomerUI = role === commonLabels?.customerRole;

  const projectItems = isBusinessUI
    ? businessProjectItems
    : customerProjectItems;
  const totalCount = isBusinessUI ? businessTotalCount : customerTotalCount;
  const customerstatusTabs = [
    {
      label: t?.("myProjectsPageConstants.myProjectsCardAll"),
      value: commonLabels.all,
    },
    {
      label: t?.("myProjectsPageConstants.myProjectsCardPublished"),
      value: commonLabels.published,
    },
    {
      label: t?.("myProjectsPageConstants.myProjectsCardAssigned"),
      value: commonLabels.assigned,
    },
    {
      label: t?.("myProjectsPageConstants.myProjectsCardCompleted"),
      value: commonLabels.completed,
    },
  ];

  const businessStatusTabs = [
    {
      label: t?.("myProjectsPageConstants.myProjectsCardAll"),
      value: commonLabels.all,
    },
    {
      label: t?.("myProjectsPageConstants.myProjectsCardPublished"),
      value: commonLabels.published,
    },
    {
      label: t?.("myProjectsPageConstants.myProjectsCardAssigned"),
      value: commonLabels.assigned,
    },
    {
      label: t?.("myProjectsPageConstants.myProjectsCardCompleted"),
      value: commonLabels.completed,
    },
  ];

  const statusTabs = isBusinessUI ? businessStatusTabs : customerstatusTabs;
  const [activeIndex, setActiveIndex] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectCardProps | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const activeTabValue = statusTabs?.[activeIndex]?.value;

  const getStatusForPayload = (tabValue: string): string | undefined => {
    switch (tabValue) {
      case commonLabels?.all:
        return undefined;
      case commonLabels?.published:
        return commonLabels.publishedValue;
      case commonLabels?.assigned:
        return commonLabels.assignedValue;
      case commonLabels?.completed:
        return commonLabels.completedValue;
      default:
        return undefined;
    }
  };

  const handleProjectClick = (project: ProjectCardProps) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  const fetchMoreProjects = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const newLimit = limit + 10;
    const status = getStatusForPayload(activeTabValue);
    const payload: ListOfProjectPayload = {
      sortKey: "_id",
      sortValue: "desc",
      page: 1,
      limit: newLimit,
    };
    if (status) {
      payload.status = status;
    }
    try {
      if (isBusinessUI) {
        await dispatch(ListOfMyProjectBusiness({ payload }));
      } else {
        await dispatch(ListOfMyProjectCustomer({ payload }));
      }
      setLimit(newLimit);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setLimit(10);
    const status = getStatusForPayload(activeTabValue);
    const payload: ListOfProjectPayload = {
      sortKey: "_id",
      sortValue: "desc",
      page: 1,
      limit: 10,
    };
    if (status) {
      payload.status = status;
    }
    if (isBusinessUI) {
      dispatch(ListOfMyProjectBusiness({ payload }));
    } else if (isCustomerUI) {
      dispatch(ListOfMyProjectCustomer({ payload }));
    }
  }, [dispatch, activeTabValue, isBusinessUI, isCustomerUI]);

  const renderProjectsContent = () => {
    if (isLoading && !isLoadingMore) {
      return (
        <div className="flex items-center justify-center mt-[20px] min-h-screen">
          <BaseLoader size="lg" />
        </div>
      );
    }

    if (projectItems?.length > 0) {
      return (
        <div>
          {projectItems?.map((project, index) => {
            const cardProject: ProjectCardProps = {
              _id: project?._id ?? "",
              title: project?.title ?? "",
              description: project?.description ?? "",
              category: project?.category?.name ?? "",
              location: project?.county?.name ?? "",
              timestamp: formatDistanceToNowClean(project?.createdAt ?? "", {
                addSuffix: true,
              }),
              status: project?.status,
              isLast: index === projectItems?.length - 1,
            };

            return (
              <div
                key={project?._id ?? index}
                onClick={() => handleProjectClick(cardProject)}
              >
                <ProjectCard {...cardProject} />
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center px-[10px] sm:px-[16px] min-h-screen">
        <p className="text-obsidianBlack text-textBase font-light text-center">
          {t("commonConstants.noResultsFound")}
        </p>
      </div>
    );
  };
  return (
    <div
      className={`rounded-[16px] ${
        isBusinessUI
          ? "bg-white overflow-hidden shadow-[0px_8px_16px_0px_#108A0008]"
          : ""
      }`}
    >
      {isBusinessUI && (
        <div className="pb-0 p-[20px] border-0 border-b border-solid border-obsidianBlack border-opacity-5 bg-white">
          <BaseTabs
            tabs={businessStatusTabs?.map((t) => t?.label)}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
          />
        </div>
      )}
      <div className="flex min-h-screen flex-col md:flex-row gap-[16px]">
        {isCustomerUI && (
          <div className="bg-white rounded-[16px] md:pt-[16px] px-[16px] md:px-[0px] flex md:block">
            <div className="flex md:block gap-2 overflow-x-auto md:overflow-visible shadow-[0px_8px_16px_0px_#108A0008]">
              {customerstatusTabs?.map((tab, index) => (
                <BaseButton
                  key={tab?.value}
                  onClick={() => setActiveIndex(index)}
                  className={`shrink-0 md:w-full border-0 !justify-start px-[10px] xs:px-[10px] sm:px-[20px] py-[16px] md:px-[30px] rounded-none text-textSm font-light transition-all xl:leading-[100%] xl:tracking-[0.3px] space-y-[1px] ${
                    activeIndex === index
                      ? "bg-deepTeal bg-opacity-[0.03] text-deepTeal border-solid border-b-4 md:border-b-0 md:border-l-4 border-deepTeal"
                      : "text-obsidianBlack bg-white"
                  }`}
                >
                  {tab?.label}
                </BaseButton>
              ))}
            </div>
          </div>
        )}

        <div
          className={`bg-white w-full ${
            isCustomerUI ? "rounded-[16px] p-[24px]" : "py-[24px] px-[20px]"
          }`}
        >
          {renderProjectsContent()}
          {!isLoading && projectItems?.length > 0 && (
            <PaginationInfo
              currentCount={projectItems?.length ?? 0}
              totalCount={totalCount}
              itemLabel={t("projectsPageConstants.projects")}
              onLoadMore={fetchMoreProjects}
              isLoadingMore={isLoadingMore}
              className="mt-[20px]"
            />
          )}
        </div>
      </div>
      <ProjectDetailsModal
        visible={isModalVisible}
        onHide={handleCloseModal}
        project={selectedProject}
      />
    </div>
  );
}

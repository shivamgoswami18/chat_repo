"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { ProjectCardProps } from "@/types/project";
import { getTranslationSync } from "@/i18n/i18n";
import BaseDebounceInput from "../base/BaseDebounceInput";
import BaseLoader from "../base/BaseLoader";
import { SearchIcon } from "@/assets/icons/CommonIcons";
import ProjectDetailsModal from "./ProjectDetailsModal";
import PaginationInfo from "../common/PaginationInfo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ListOfProject, ListOfProjectPayload } from "@/lib/api/ProjectApi";
import {
  commonLabels,
  formatDistanceToNowClean,
  getSortValue,
} from "../constants/Common";
import { sortValuesConstants } from "../constants/Projects";
import { ProjectFilterParams } from "./ProjectsFilterSection";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

interface BrowseProjectsSectionProps {
  filterParams: ProjectFilterParams;
}

const BrowseProjectsSection: React.FC<BrowseProjectsSectionProps> = ({
  filterParams,
}) => {
  const sortValue = filterParams.sort || sortValuesConstants.newest;
  const dispatch = useAppDispatch();
  const projectItems = useAppSelector(
    (state) => state?.project?.projects?.items ?? []
  );
  const totalCount = useAppSelector(
    (state) => state?.project?.projects?.totalCount ?? 0
  );
  const isLoading = useAppSelector((state) => state?.auth?.loading ?? false);

  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectCardProps | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const buildFilterPayload = (search: string) => {
    return {
      search,
      ...(filterParams?.serviceChildren?.length > 0
        ? { typeOfWork: filterParams.serviceChildren }
        : {}),
      ...(filterParams?.locationChildren?.length > 0
        ? { municipality: filterParams.locationChildren }
        : {}),
      ...(filterParams?.serviceParents?.length > 0
        ? { category: filterParams.serviceParents }
        : {}),
      ...(filterParams?.locationParents?.length > 0
        ? { county: filterParams.locationParents }
        : {}),
    };
  };

  const fetchMoreProjects = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const newLimit = limit + 10;
    try {
      const payload: ListOfProjectPayload = {
        sortKey: "_id",
        sortValue: sortValue
          ? getSortValue(sortValue)
          : commonLabels.descendingValue,
        page: 1,
        limit: newLimit,
        ...buildFilterPayload(searchQuery),
      };
      await dispatch(ListOfProject({ payload }));
      setLimit(newLimit);
    } finally {
      setIsLoadingMore(false);
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

  const renderProjectsContent = () => {
    if (isLoading && !isLoadingMore) {
      return (
        <div className="flex items-center justify-center mt-[20px] px-[10px] sm:px-[16px]">
          <BaseLoader size="lg" />
        </div>
      );
    }

    if (projectItems?.length > 0) {
      return projectItems?.map((project, index) => {
        const cardProject: ProjectCardProps = {
          _id: project?._id ?? "",
          title: project?.title ?? "",
          description: project?.description ?? "",
          category: project?.category?.name ?? "",
          location: project?.county?.name ?? "",
          timestamp: formatDistanceToNowClean(project?.createdAt ?? "", {
            addSuffix: true,
          }),
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
      });
    }

    return (
      <div className="flex items-center justify-center px-[10px] sm:px-[16px]">
        <p className="text-obsidianBlack text-textBase font-light text-center">
          {t("commonConstants.noResultsFound")}
        </p>
      </div>
    );
  };

  useEffect(() => {
    setLimit(10);
    const payload: ListOfProjectPayload = {
      sortKey: "_id",
      sortValue: getSortValue(sortValue),
      page: 1,
      limit: 10,
      ...buildFilterPayload(searchQuery),
    };
    dispatch(ListOfProject({ payload }));
  }, [
    dispatch,
    searchQuery,
    sortValue,
    filterParams.serviceChildren,
    filterParams.locationChildren,
    filterParams.serviceParents,
    filterParams.locationParents,
  ]);

  return (
    <>
      <div className="flex-1 bg-white rounded-t-[16px] pt-[10px] sm:pt-[14px] min-h-screen flex flex-col">
        <h2 className="text-obsidianBlack text-textBase font-light px-[10px] sm:px-[16px] xl:leading-[100%] xl:tracking-[0px]">
          {t("projectsPageConstants.browseProjects")}
        </h2>
        <div className="mt-[10px] mb-[5px] px-[10px] sm:px-[16px]">
          <BaseDebounceInput
            name="search"
            placeholder={t("projectsPageConstants.search")}
            onDebouncedChange={(value) => setSearchQuery(value)}
            icon={<SearchIcon />}
            className="pl-[32px] border-[2px] focus:ring-0 border-obsidianBlack border-opacity-5 rounded-[8px] py-[12px] text-obsidianBlack text-textSm font-light placeholder:text-obsidianBlack placeholder:text-opacity-40 placeholder:text-textSm placeholder:font-light xl:tracking-[100%] xl:leading-[0px]"
            fullWidth
          />
        </div>
        <div
          className={
            (isLoading && !isLoadingMore) ||
            (projectItems?.length === 0 && !isLoading)
              ? "flex-1 flex items-center justify-center"
              : "mb-[20px]"
          }
        >
          {renderProjectsContent()}
        </div>
        {projectItems?.length > 0 && (
          <PaginationInfo
            currentCount={projectItems?.length ?? 0}
            totalCount={totalCount}
            itemLabel={t("projectsPageConstants.projects")}
            onLoadMore={fetchMoreProjects}
            isLoadingMore={isLoadingMore}
            className="pb-[20px]"
          />
        )}
      </div>
      <ProjectDetailsModal
        visible={isModalVisible}
        onHide={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default BrowseProjectsSection;

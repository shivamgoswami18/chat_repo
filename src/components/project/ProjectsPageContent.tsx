"use client";

import { useState, useEffect } from "react";
import ProjectsFilterSection, {
  ProjectFilterParams,
} from "./ProjectsFilterSection";
import BrowseProjectsSection from "./BrowseProjectsSection";
import BrowseProjectsRightSideSection from "./BrowseProjectsRightSideSection";
import SubscriptionModalWrapper from "@/components/subscription/SubscriptionModal";
import { sortValuesConstants } from "../constants/Projects";
import { useAppDispatch } from "@/lib/store/hooks";
import { ViewProfile } from "@/lib/api/UserApi";

export default function ProjectsPageContent() {
  const dispatch = useAppDispatch();
  const [filterParams, setFilterParams] = useState<ProjectFilterParams>({
    serviceParents: [],
    serviceChildren: [],
    locationParents: [],
    locationChildren: [],
    budgetRange: "",
    sort: sortValuesConstants.newest,
  });

  useEffect(() => {
    dispatch(ViewProfile());
  }, [dispatch]);

  const handleFilterChange = (filters: ProjectFilterParams) => {
    setFilterParams(filters);
  };

  return (
    <>
      <SubscriptionModalWrapper />
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col md:flex-row gap-[16px] items-start">
          <div className="w-full md:w-[280px] lg:w-[280px] flex-shrink-0">
            <ProjectsFilterSection onFilterChange={handleFilterChange} />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <BrowseProjectsSection filterParams={filterParams} />
          </div>
          <div className="hidden xl:block w-[280px] flex-shrink-0">
            <BrowseProjectsRightSideSection />
          </div>
        </div>
        <div className="w-full md:w-full xl:hidden">
          <BrowseProjectsRightSideSection />
        </div>
      </div>
    </>
  );
}

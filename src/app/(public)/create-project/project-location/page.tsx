import { pageTitles } from "@/components/constants/PageTitles";
import CreateProjectStepper from "@/components/project/CreateProjectStepper";
import ProjectLocation from "@/components/project/ProjectLocation";
import { createMetadata } from "@/lib/metadata/metadataHelper";
import React from "react";

export const metadata = createMetadata(pageTitles.projectLocationPageTitle)
function page() {
  return (
    <CreateProjectStepper currentStep={3}>
        <ProjectLocation/>
    </CreateProjectStepper>
  );
}

export default page;

import { pageTitles } from "@/components/constants/PageTitles";
import CreateProjectStepper from "@/components/project/CreateProjectStepper";
import ProjectDescription from "@/components/project/ProjectDescription";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.projectDescriptionPageTitle)
function page() {
  return (
    <CreateProjectStepper currentStep={2}>
      <ProjectDescription/>
    </CreateProjectStepper>
  );
}

export default page;

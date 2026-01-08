import SelectService from "@/components/project/SelectService";
import CreateProjectStepper from "@/components/project/CreateProjectStepper";
import { createMetadata } from "@/lib/metadata/metadataHelper";
import { pageTitles } from "@/components/constants/PageTitles";

export const metadata = createMetadata(pageTitles.selectServicePageTitle)
function page() {
  return (
    <CreateProjectStepper currentStep={1}>
      <SelectService />
    </CreateProjectStepper>
  );
}

export default page;

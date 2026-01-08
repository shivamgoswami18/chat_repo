import { pageTitles } from "@/components/constants/PageTitles";
import ContactInformation from "@/components/project/ContactInformation";
import CreateProjectStepper from "@/components/project/CreateProjectStepper";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.contactDetailPageTitle)
function page() {
  return (
    <CreateProjectStepper currentStep={4}>
        <ContactInformation/>
    </CreateProjectStepper>
  );
}

export default page;

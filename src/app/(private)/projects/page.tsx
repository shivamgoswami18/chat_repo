import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";
import ProjectsPageContent from "@/components/project/ProjectsPageContent";

export const metadata = createMetadata(pageTitles.projectPageTitle);
export default function Page() {
  return <ProjectsPageContent />;
}

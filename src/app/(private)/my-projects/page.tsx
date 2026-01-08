import { createMetadata } from "@/lib/metadata/metadataHelper";
import { pageTitles } from "@/components/constants/PageTitles";
import MyProjectsSection from "@/components/my-projects/MyProjectsSection";

export const metadata = createMetadata(pageTitles.myProjectsPageTitle);
export default function Page() {
  return <MyProjectsSection/>;
}

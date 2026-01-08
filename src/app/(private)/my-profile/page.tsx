import { pageTitles } from "@/components/constants/PageTitles";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { createMetadata } from "@/lib/metadata/metadataHelper";
export const metadata = createMetadata(pageTitles.myProfilePageTitle);
function page() {
 
  return <ProfileSidebar/>;
}

export default page;

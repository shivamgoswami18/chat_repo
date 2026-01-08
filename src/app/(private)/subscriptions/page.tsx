import { pageTitles } from "@/components/constants/PageTitles";
import Subscription from "@/components/subscription/Subscription";
import { createMetadata } from "@/lib/metadata/metadataHelper";
export const metadata = createMetadata(pageTitles.subscriptionsPageTitle)
function page() {
  return <Subscription/>
}

export default page;

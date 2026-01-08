import { createMetadata } from "@/lib/metadata/metadataHelper";
import { pageTitles } from "@/components/constants/PageTitles";
import Dashboard from "@/components/dashboard/Dashboard";

export const metadata = createMetadata(pageTitles.dashboardPageTitle);
export default function Page() {
  return <div><Dashboard /></div>;
}

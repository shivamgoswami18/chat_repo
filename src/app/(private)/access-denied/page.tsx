import { createMetadata } from "@/lib/metadata/metadataHelper";
import { pageTitles } from "@/components/constants/PageTitles";
import AccessDeniedContent from "@/components/common/AccessDeniedContent";

export const metadata = createMetadata(pageTitles.accessDeniedPageTitle);

export default function AccessDeniedPage() {
  return <AccessDeniedContent />;
}

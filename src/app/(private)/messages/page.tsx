import { createMetadata } from "@/lib/metadata/metadataHelper";
import { pageTitles } from "@/components/constants/PageTitles";
import Messages from "@/components/message/Messages";

export const metadata = createMetadata(pageTitles.messagePageTitle);
export default function Page() {
  return <Messages />;
}

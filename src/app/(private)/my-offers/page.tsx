import { createMetadata } from "@/lib/metadata/metadataHelper";
import { pageTitles } from "@/components/constants/PageTitles";
import MyOffers from "@/components/my-offers/MyOffers";

export const metadata = createMetadata(pageTitles.myOffersPageTitle);
export default function Page() {
  return <MyOffers />;
}

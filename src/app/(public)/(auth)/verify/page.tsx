import VerifyOTP from "@/components/auth/VerifyOtp";
import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.verifyOtpPageTitle);

const VerifyOtpPage = () => {
  return <VerifyOTP />;
};

export default VerifyOtpPage;

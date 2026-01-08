import ForgotPasswordStepper from "@/components/auth/ForgotPasswordStepper";
import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.forgotPasswordPageTitle);

const ForgotPasswordPage = () => {
  return <ForgotPasswordStepper />;
};

export default ForgotPasswordPage;

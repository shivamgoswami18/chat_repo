import ResetPasswordSuccess from '@/components/auth/ResetPasswordSuccess';
import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.passwordSuccessPageTitle);

function PasswordVerificationSuccessPage() {
  return <ResetPasswordSuccess />;
}

export default PasswordVerificationSuccessPage
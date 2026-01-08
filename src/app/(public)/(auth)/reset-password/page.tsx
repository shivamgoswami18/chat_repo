import ResetPassword from '@/components/auth/ResetPassword';
import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.resetPasswordPageTitle);

function ResetPasswordPage() {
  return <ResetPassword />;
}

export default ResetPasswordPage
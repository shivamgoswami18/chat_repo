import CreatePassword from "@/components/auth/CreatePassword";
import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.createPasswordPageTitle);

const RegisterPage = () => {
  return <CreatePassword />;
};

export default RegisterPage;

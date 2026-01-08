import Register from "@/components/auth/Register";
import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.registerPageTitle);

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;

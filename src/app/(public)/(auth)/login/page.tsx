import LogIn from "@/components/auth/LogIn";
import { pageTitles } from "@/components/constants/PageTitles";
import { createMetadata } from "@/lib/metadata/metadataHelper";

export const metadata = createMetadata(pageTitles.logInPageTitle);

const SignInPage = () => {
  return <LogIn />;
};

export default SignInPage;

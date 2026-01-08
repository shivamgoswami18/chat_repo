import Link from "next/link";
import BaseButton from "../base/BaseButton";
import { getTranslationSync } from "@/i18n/i18n";
import MobileMenu from "./MobileMenu";
import BecomeAProfessionalButton from "../home/BecomeAProfessionalButton";
import { routePath } from "../constants/RoutePath";

const HomeHeader = () => {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  return (
    <div className="w-full bg-white relative">
      <div className="w-full mx-auto max-w-container flex items-center justify-between px-[20px] py-[5px] xs:px-[40px] md:py-[15px] md:px-[80px] desktop:px-[152px] desktop:py-[21px]">
        <div className="flex justify-center items-center">
          <p className="text-obsidianBlack font-bold text-titleXl xl:leading-[100%] xl:tracking-[-1px]">
            LOGOO
          </p>
        </div>

        <div className="hidden md:flex flex-row justify-center items-center gap-[10px]">
          <BecomeAProfessionalButton
            label={t("homeHeaderConstants.becomeAProfessional")}
            className="text-textSm sm:text-textBase font-medium text-obsidianBlack bg-white cursor-pointer border-charcoalPale border-[2px] rounded-[8px] py-[9px] px-[19px] xl:leading-[24px] tracking-[0px]"
          />

          <Link href={routePath.createProjectSelectService}>
            <BaseButton
              label={t("homeHeaderConstants.postAProject")}
              className="text-textSm sm:text-textBase font-medium bg-deepTeal text-white border-none cursor-pointer rounded-[8px] py-[9px] px-[14px] xl:leading-[24px] tracking-[0px]"
            />
          </Link>
        </div>

        <MobileMenu />
      </div>
    </div>
  );
};

export default HomeHeader;

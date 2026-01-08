"use client";
import { getTranslationSync } from "@/i18n/i18n";
import BaseButton from "../base/BaseButton";
import { PasswordVerificationSuccessIcon } from "@/assets/icons/CommonIcons";
import { useRouter } from "next/navigation";
import { routePath } from "../constants/RoutePath";

function ResetPasswordSuccess() {
  const router = useRouter();
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  return (
    <div className="bg-cyanGradient rounded-[16px] min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center h-full px-4 py-[64px] figmascreen:px-[510px] figmascreen:pt-[272px] figmascreen:pb-[332px]">
        <div className="mx-auto flex flex-col justify-center items-center ">
          <div className="mb-[28px]">
            <div className="relative rounded-[200px] h-[100px] w-[100px] shadow-[0px_0px_32px_0px_rgba(16,138,0,0.1)]">
              <div className="absolute flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <PasswordVerificationSuccessIcon />
              </div>
            </div>
          </div>
          <p className="text-textLg md:text-titleXxlPlusPlus text-obsidianBlack font-bold xl:leading-[40px] space-y-[12px] xl:tracking-[-2%] mb-[10px]">
            {t("passwordResetSuccessConstants.passwordResetSuccessful")}
          </p>
          <p className="text-obsidianBlack text-opacity-50 text-textSm mb-[24px] xl:leading-[20px] space-y-[12px] xl:tracking-[0%]">
            {t(
              "passwordResetSuccessConstants.yourPasswordHasBeenSuccessfullyUpdated"
            )}
          </p>
          <BaseButton
            label={t("logInPageConstants.logIn")}
            onClick={() => router.push(routePath.logIn)}
            className="w-full mt-[36px] bg-deepTeal text-white rounded-lg border-0 py-[13px] font-medium text-textBase xl:leading-[24px] xl:tracking-[0px]"
          />
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordSuccess;

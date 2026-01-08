"use client";
import Image from "next/image";
import { RIGHT_SIDE_LINKS } from "@/components/constants/Projects";
import user_image from "@/assets/images/user_dummy_image.png";
import BaseButton from "@/components/base/BaseButton";
import DashboardFooter from "@/components/layout/DashboardFooter";
import { getTranslationSync } from "@/i18n/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import { ViewProfile } from "@/lib/api/UserApi";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};
const BrowseProjectsRightSideSection = () => {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.user.profile);
  useEffect(() => {
    dispatch(ViewProfile());
  }, [dispatch]);
  return (
    <div className="w-full flex flex-col">
      <div className="bg-white rounded-[16px] px-[10px] py-[10px] sm:px-[16px] sm:py-[16px] md:py-[30px]">
        <div className="flex flex-col items-center">
          <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden">
            <Image
              src={user_image}
              alt={t("HeaderConstants.userImageAlt")}
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          </div>

          <div className="mt-[10px] mb-[24px] flex flex-col items-center justify-center">
            <p className="text-obsidianBlack text-textBase font-light text-opacity-70 xl:leading-[100%] xl:tracking-[0px]">
              {t("projectsPageConstants.welcome")}
            </p>

            <h3 className="text-obsidianBlack text-textBase font-bold xl:leading-[100%] xl:tracking-[0px]">
              {profileData?.business_name}
            </h3>
          </div>

          <div className="w-full flex flex-col rounded-[12px] bg-mintUltraLight px-[16px] py-[14px]">
            <p className="text-obsidianBlack text-textSm font-light text-opacity-70 xl:leading-[100%] xl:tracking-[0px]">
              {t("projectsPageConstants.yourCurrentBalance")}
            </p>

            <p className="text-obsidianBlack text-textBase font-medium mt-[4px] mb-[14px] xl:leading-[100%] xl:tracking-[0px]">
              {profileData?.total_clips} {t("projectsPageConstants.clips")}
            </p>

            <BaseButton
              label={t("projectsPageConstants.buyMoreClips")}
              className="w-full bg-white border-[2px] border-deepTeal text-deepTeal rounded-[8px] py-[6px] px-[16px] font-medium text-textSm xl:leading-[24px] xl:tracking-[0px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] mt-[16px] mb-[24px] px-[10px] py-[10px] sm:px-[16px] sm:py-[20px]">
        <div className="flex flex-col gap-[8px]">
          {RIGHT_SIDE_LINKS?.map((link) => (
            <p
              key={link?.id}
              className="text-obsidianBlack text-textBase font-light text-opacity-70 cursor-pointer xl:leading-[32px] xl:tracking-[0px]"
            >
              {link?.text}
            </p>
          ))}
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default BrowseProjectsRightSideSection;

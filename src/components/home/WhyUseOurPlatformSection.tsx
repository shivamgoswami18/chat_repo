import Image from "next/image";
import BaseButton from "../base/BaseButton";
import { getTranslationSync } from "@/i18n/i18n";
import why_use_our_platform_men_image from "@/assets/images/why_use_our_platform_men_image.png";
import why_use_our_platform_men_image_left_shape from "@/assets/images/why_use_our_platform_men_image_left_shape.png";
import why_use_our_platform_men_image_right_shape from "@/assets/images/why_use_our_platform_men_image_right_shape.png";
import { OurPlatformCheckmarkIcon } from "@/assets/icons/CommonIcons";

const WhyUseOurPlatformSection = () => {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  const features = [
    t("homePageConstants.verifiedProfessionals"),
    t("homePageConstants.compareOffersEasily"),
    t("homePageConstants.freeAndNonBinding"),
    t("homePageConstants.secureCommunication"),
  ];

  return (
    <div className="w-full bg-tealGreenPale mb-[50px] md:mb-[100px] pb-[50px] xl:pb-0 pt-[20px] xl:pt-[60px] relative overflow-visible">
      <div className="w-full mx-auto max-w-container flex flex-col xl:flex-row items-center justify-between px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[152px] relative">
        <div className="w-full max-w-[280px] xxs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] xl:max-w-[450px] flex justify-center items-center mb-[40px] xl:mb-0 overflow-hidden xxs:overflow-visible relative xl:-mt-[100px]">
          <div className="relative inline-block w-full">
            <div className="absolute left-[-70px] top-[50%] hidden md:block">
              <Image
                src={why_use_our_platform_men_image_left_shape}
                alt={t(
                  "homePageConstants.whyUseOurPlatformMenImageLeftShapeAlt"
                )}
                className="object-contain"
              />
            </div>

            <Image
              src={why_use_our_platform_men_image}
              alt={t("homePageConstants.whyUseOurPlatformMenImageAlt")}
              className="object-contain relative w-full h-auto"
            />
          </div>
        </div>

        <div className="flex flex-col w-full xl:max-w-[60%] xl:pl-[60px] relative overflow-visible">
          <div className="absolute right-[0px] lg:right-[50px] xl:right-[-50px] top-[30%] xl:top-[45%] hidden md:block">
            <Image
              src={why_use_our_platform_men_image_right_shape}
              alt={t(
                "homePageConstants.whyUseOurPlatformMenImageRightShapeAlt"
              )}
              className="object-contain"
            />
          </div>
          <h2 className="text-titleMid xxs:text-titleXl md:text-titleXxlPlus desktop:text-titleXxxl font-bold text-obsidianBlack xl:leading-[100%] tracking-[0px]">
            {t("homePageConstants.whyUseOurPlatform")}
          </h2>

          <p className="text-textBase sm:text-textMd md:text-textLg font-extraLight text-obsidianBlack mt-[10px] mb-[30px] xl:leading-[32px] tracking-[0px]">
            {t("homePageConstants.findTheRightBusinessForYourProject")}
          </p>

          <div className="flex flex-wrap gap-y-[16px] mb-[48px]">
            {features?.map((feature, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 flex items-center gap-[10px]"
              >
                <div className="flex justify-center items-center w-[30px] h-[30px] bg-deepTeal rounded-full">
                  <OurPlatformCheckmarkIcon />
                </div>
                <span className="text-textBase sm:text-textMd md:text-textLg font-light text-obsidianBlack xl:leading-[32px] tracking-[0px]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <BaseButton
            label={t("homePageConstants.findBusinesses")}
            className="text-textSm sm:text-textBase font-medium bg-deepTeal border-none cursor-pointer text-white rounded-[8px] py-[15px] px-[55px] xl:leading-[24px] tracking-[0px] w-full sm:w-auto items-center justify-center self-start"
          />
        </div>
      </div>
    </div>
  );
};

export default WhyUseOurPlatformSection;

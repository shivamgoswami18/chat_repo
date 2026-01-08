import Image from "next/image";
import { getTranslationSync } from "@/i18n/i18n";
import professional_banner_men_image from "@/assets/images/professional_banner_men_image.png";
import professional_banner_men_image_shape from "@/assets/images/professional_banner_men_image_shape.png";
import BecomeAProfessionalButton from "./BecomeAProfessionalButton";

const BecomeAProfessionalBannerSection = () => {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  return (
    <div className="w-full bg-deepTeal xl:bg-white xl:pt-[60px]">
      <div className="w-full mx-auto max-w-container px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[152px]">
        <div className="w-full bg-deepTeal rounded-[16px] relative overflow-visible">
          <div className="flex flex-col xl:flex-row items-center justify-between pt-[20px] xl:pt-[0px] xl:px-[84px]">
            <div className="flex flex-col w-full xl:max-w-[60%]">
              <h2 className="text-titleMid xxs:text-titleXl md:text-titleXxlPlus desktop:text-titleXxxl font-bold text-white xl:leading-[48px] tracking-[0px]">
                {t("homePageConstants.areYouAProfessional")}
                <br />
                {t("homePageConstants.getNewCustomersEveryDay")}
              </h2>

              <p className="text-textBase md:text-textLg font-extraLight text-white xl:leading-[26px] tracking-[0px] my-[26px]">
                {t("homePageConstants.professionalBannerDescription")}
              </p>

              <BecomeAProfessionalButton
                label={t("homePageConstants.registerAsAProfessional")}
                className="text-textSm md:text-textBase font-medium bg-white text-deepTeal border-none cursor-pointer rounded-[8px] py-[15px] px-[20px] md:px-[39px] xl:leading-[24px] tracking-[0px] w-full sm:w-auto items-center justify-center self-start"
              />
            </div>

            <div className="w-full max-w-[280px] xxs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] xl:max-w-[450px] flex justify-center items-center relative overflow-hidden xxs:overflow-visible mt-[10px] xl:-mt-[40px]">
              <div className="relative inline-block w-full">
                <Image
                  src={professional_banner_men_image}
                  alt={t("homePageConstants.professionalBannerMenImageAlt")}
                  className="object-contain relative w-full h-auto"
                />

                <div className="absolute top-[120px] right-[-150px] xl:top-[140px] xl:right-[-130px] hidden md:block">
                  <Image
                    src={professional_banner_men_image_shape}
                    alt={t("homePageConstants.professionalBannerShapeImageAlt")}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAProfessionalBannerSection;

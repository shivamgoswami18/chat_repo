import Link from "next/link";
import hero_section_men_image from "@/assets/images/hero_section_men_image.jpg";
import hero_section_shape_image from "@/assets/images/hero_section_shape_image.png";
import Image from "next/image";
import BaseButton from "../base/BaseButton";
import {
  HomePageUserIcon,
  HomePageRatingIcon,
} from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import BecomeAProfessionalButton from "./BecomeAProfessionalButton";
import { HOME_PAGE_STATS } from "@/lib/api/ApiRoutes";
import { get } from "@/lib/api/ServerApiService";
import { routePath } from "../constants/RoutePath";

interface HomePageStats {
  completedProjects?: number;
  averageRating?: number;
}

const HeroSection = async () => {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  let stats: HomePageStats = {
    completedProjects: undefined,
    averageRating: undefined,
  };

  try {
    const response = await get<HomePageStats>(HOME_PAGE_STATS, {
      cache: "no-store",
    });

    if (response.data) {
      stats = {
        completedProjects:
          response.data.completedProjects ?? stats.completedProjects,
        averageRating: response.data.averageRating ?? stats.averageRating,
      };
    }
  } catch (error) {
    console.error("Failed to fetch home page stats", error);
  }

  return (
    <div className="w-full bg-aquaMist pb-[50px] md:pb-[0px]">
      <div className="w-full mx-auto max-w-container flex flex-col xl:flex-row items-center justify-between p-[20px] xs:p-[40px] md:px-[80px] md:py-[50px] desktop:px-[152px] desktop:py-[77px]">
        <div className="flex flex-col w-full xl:max-w-[50%]">
          <h1 className="text-titleMid xxs:text-titleXl sm:text-titleXxl md:text-titleXxlPlus xl:text-titleHuge font-bold text-obsidianBlack xl:leading-[72px] xl:tracking-[-1px]">
            {t("homePageConstants.findTrustedProfessionals")}
          </h1>

          <p className="text-textBase sm:text-textMd md:text-textLg font-extraLight text-obsidianBlack my-[10px] xl:mt-[34px] xl:mb-[42px] xl:leading-[32px] tracking-[0px]">
            {t("homePageConstants.projectDescription")}
          </p>

          <div className="flex flex-col xs:flex-row gap-[10px] xs:gap-[24px]">
            <Link href={routePath.createProjectSelectService}>
              <BaseButton
                label={t("homePageConstants.postAProjectFree")}
                className="text-textSm sm:text-textBase font-medium bg-deepTeal border-none cursor-pointer text-white rounded-[8px] py-[15px] px-[15px] sm:px-[25px] xl:leading-[24px] tracking-[0px] w-full xs:w-auto items-center justify-center"
              />
            </Link>

            <BecomeAProfessionalButton
              label={t("homeHeaderConstants.becomeAProfessional")}
              className="text-textSm sm:text-textBase font-medium text-obsidianBlack bg-white cursor-pointer border-charcoalPale border-[2px] rounded-[8px] py-[15px] px-[15px] sm:px-[29px] xl:leading-[24px] tracking-[0px] w-full xs:w-auto items-center justify-center"
            />
          </div>
        </div>

        <div className="w-full xl:max-w-[50%] flex justify-center xl:justify-end items-center mt-[50px] xl:mt-[20px] md:mb-[60px]">
          <div className="relative flex flex-col justify-center items-center w-full max-w-[500px]">
            <div className="relative w-full max-w-[450px] max-h-[700px] overflow-hidden rounded-[35px]">
              <Image
                src={hero_section_men_image}
                alt={t("homePageConstants.heroSectionMenImageAlt")}
                className="w-full h-auto object-cover transition-transform scale-[1.6]"
              />
            </div>

            <div className="absolute top-[-50px] right-[-10px] z-10 hidden md:block">
              <Image
                src={hero_section_shape_image}
                alt={t("homePageConstants.heroSectionShapeImageAlt")}
              />
            </div>

            <div className="flex relative w-full md:w-auto mt-[50px] md:mt-[0px] md:absolute md:bottom-[120px] md:left-[-75px] z-20 bg-white rounded-[8px] p-[10px]">
              <div className="flex items-center gap-[12px]">
                <div className="bg-deepTeal bg-opacity-5 p-[12px] rounded-[10px]">
                  <HomePageUserIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-titleSm sm:text-titleMid md:text-titleLg font-bold xl:leading-[32px] tracking-[0px]">
                    {stats.completedProjects}
                  </span>
                  <span className="text-textSm sm:text-textBase font-light xl:leading-[100%] tracking-[0px] text-obsidianBlack text-opacity-70">
                    {t("homePageConstants.satisfiedClients")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex relative w-full md:w-auto md:absolute md:top-[200px] md:right-[-20px] xl:top-[280px] xl:right-[-20px] z-20 bg-white rounded-[8px] p-[10px] mt-[10px] md:mt-[0px]">
              <div className="flex md:flex-col gap-[12px]">
                <div className="bg-deepTeal bg-opacity-5 p-[12px] rounded-[10px] flex justify-center items-center">
                  <HomePageRatingIcon />
                </div>
                <div className="flex flex-col md:items-center">
                  <span className="text-titleSm sm:text-titleMid md:text-titleLg font-bold xl:leading-[32px] tracking-[0px]">
                    {stats.averageRating?.toFixed(1)}
                  </span>
                  <span className="text-textSm sm:text-textBase font-light xl:leading-[100%] tracking-[0px] text-obsidianBlack text-opacity-70">
                    {t("homePageConstants.rating")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

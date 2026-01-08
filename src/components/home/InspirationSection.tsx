import { getTranslationSync } from "@/i18n/i18n";
import Image from "next/image";
import { HomePageItem } from "@/types/homePage";
import { BaseImageURL } from "@/lib/api/ApiService";
import { FallBackImage } from "@/assets/icons/CommonIcons";

interface InspirationSectionProps {
  items: HomePageItem[];
}

const resolveImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${BaseImageURL}${path}`;
};

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const InspirationSection = ({ items }: InspirationSectionProps) => {

  return (
    <div className="w-full bg-white mt-[25px] md:mt-[48px] mb-[50px] md:mb-[100px]">
      <div className="w-full flex flex-col justify-center items-center mx-auto max-w-container px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[152px]">
        <h2 className="text-titleMid xxs:text-titleXl md:text-titleXxlPlus desktop:text-titleXxxl font-bold text-obsidianBlack text-center xl:leading-[100%] tracking-[0px] mb-[40px] md:mb-[60px]">
          {t("homePageConstants.inspirationGoodAdviceAndNews")}
        </h2>

        <div className="flex flex-col lg:flex-row gap-[20px] w-full">
          {items?.map((article) => {
            const imageUrl = resolveImageUrl(article.image);

            return (
              <div
                key={article._id}
                className="flex-1 bg-white rounded-[16px] overflow-hidden hover:shadow-[0px_0px_32px_0px_#108A001A]"
              >
                <div className="relative w-full h-[250px] flex items-center justify-center bg-offWhite">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={article?.title}
                      fill
                      className="object-cover max-h-[250px]"
                    />
                  ) : (
                    <FallBackImage />
                  )}
                </div>
              <div className="p-[16px] md:p-[24px]">
                <h3 className="text-textBase md:text-textLg xl:text-titleMid font-medium text-obsidianBlack mb-[15px] xl:leading-[32px] tracking-[0px]">
                  {article?.title}
                </h3>
                <p className="text-textSm md:text-textBase font-extraLight text-obsidianBlack text-opacity-50 xl:leading-[100%] tracking-[0px]">
                  {new Date(article.createdAt).toLocaleDateString("no-NO")}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InspirationSection;

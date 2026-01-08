import { ServiceArrowRightIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import Image from "next/image";
import service_men_image from "@/assets/images/service_men_image.png";
import { LIST_OF_SERVICE } from "@/lib/api/ApiRoutes";
import { post } from "@/lib/api/ServerApiService";
import { routePath } from "../constants/RoutePath";
import Link from "next/link";

interface ServiceItem {
  _id?: string;
  name?: string;
}

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const PopularServicesSection = async () => {

  let services: ServiceItem[] = [];

  try {
    const response = await post<{ items: ServiceItem[] }>(
      LIST_OF_SERVICE,
      {},
      {
        cache: "no-store",
      }
    );

    services = response.data?.items || [];
  } catch (error) {
    console.error("Failed to fetch popular services", error);
    services = [];
  }

  return (
    <div className="w-full bg-white mb-[50px] md:mb-[134px]">
      <div className="w-full flex flex-col justify-center items-center mx-auto max-w-container px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[152px]">
        <h2 className="text-titleMid xss:text-titleXl md:text-titleXxlPlus desktop:text-titleXxxl font-bold text-obsidianBlack text-center xl:leading-[100%] tracking-[0px]">
          {t("homePageConstants.popularServices")}
        </h2>

        <p className="max-w-[700px] text-center text-textBase desktop:text-textLg font-extraLight text-obsidianBlack xl:leading-[32px] tracking-[0px] mt-[20px] mb-[36px]">
          {t("homePageConstants.popularServicesDescription")}
        </p>

        <div className="flex flex-wrap gap-[10px] md:gap-[20px]">
          {services?.map((service) => (
            <Link
              key={service._id}
              href={routePath.createProjectSelectService}
              className="w-full sm:w-[calc((100%-10px)/2)] md:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] flex items-center justify-between px-[5px] py-[14px] xss:p-[14px] md:p-[24px] rounded-[16px] bg-white hover:bg-tealGreenPale transition-colors cursor-pointer gap-[20px] md:gap-[91px] no-underline"
            >
              <div className="flex items-center gap-[12px] md:gap-[16px] flex-1">
                <div className="flex-shrink-0">
                  <Image
                    src={service_men_image}
                    alt={service?.name ?? "service"}
                    className="w-[40px] h-[40px]"
                  />
                </div>
                <span className="text-textLg md:text-titleMid font-light text-obsidianBlack xl:leading-[32px] tracking-[0px]">
                  {service?.name}
                </span>
              </div>
              <div className="flex-shrink-0 flex justify-center items-center">
                <ServiceArrowRightIcon />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularServicesSection;

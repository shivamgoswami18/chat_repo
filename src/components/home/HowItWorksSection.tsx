"use client";

import Link from "next/link";
import BaseButton from "../base/BaseButton";
import { HowItWorksArrowRightIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import HowItWorksCard from "./HowItWorksCard";
import BaseSearchOptions, {
  type SuggestionItem,
} from "../base/BaseSearchOptions";
import BaseSlider from "../base/BaseSlider";
import { HomePageItem } from "@/types/homePage";
import { BaseImageURL } from "@/lib/api/ApiService";
import { LIST_OF_SERVICE } from "@/lib/api/ApiRoutes";
import { post } from "@/lib/api/ServerApiService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { routePath } from "../constants/RoutePath";

interface HowItWorksStep {
  imageUrl: string;
  title: string;
  description: string;
}

const resolveImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${BaseImageURL}${path}`;
};

interface HowItWorksSectionProps {
  items: HomePageItem[];
}

const HowItWorksSection = ({ items }: HowItWorksSectionProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  const howItWorksSteps: HowItWorksStep[] = items?.map((item) => ({
    imageUrl: resolveImageUrl(item.image),
    title: item.title,
    description: item.description,
  }));

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await post<{ items: { _id?: string; name?: string }[] }>(
        LIST_OF_SERVICE,
        {
          type: "DETAILS",
          search: query,
        }
      );

      const items = response.data?.items || [];

      const mapped: SuggestionItem[] = items?.map((item) => ({
        value: item._id ?? "",
        label: item.name ?? "",
      }));

      setSuggestions(mapped);
    } catch (error) {
      console.error("Failed to fetch services for search", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    router.push(routePath.createProjectSelectService);
  };

  return (
    <div className="w-full bg-white mt-[130px] mb-[50px] md:mb-[100px]">
      <div className="relative w-full mx-auto max-w-container flex flex-col px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[152px]">
        <div className="w-full mx-auto px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[152px] left-1/2 transform -translate-x-1/2 absolute  top-[-165px] md:top-[-180px]">
          <div className="relative w-full">
            <BaseSearchOptions
              placeholder={t("homePageConstants.whatDoYouNeedForYourHelp")}
              className="w-full bg-white text-textLg font-extraLight border-none text-darkGray placeholder:text-textLg placeholder:text-obsidianBlack rounded-[16px] pl-[20px] py-[20px] md:pl-[50px] pr-[90px] md:py-[34px] shadow-[0px_16px_32px_0px_#108A001A]"
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              suggestions={suggestions}
              loading={loading}
              onSelect={handleSelect}
            />
            <BaseButton
              className="bg-deepTeal border-none cursor-pointer rounded-[8px] p-[10px] flex items-center justify-center absolute right-[15px] md:right-[28px] top-1/2 transform -translate-y-1/2 z-10"
              endIcon={<HowItWorksArrowRightIcon />}
              onClick={() => {
                handleSelect();
              }}
            />
          </div>
        </div>

        <h2 className="text-titleMid xxs:text-titleXl md:text-titleXxlPlus desktop:text-titleXxxl font-bold text-obsidianBlack text-center xl:leading-[100%] tracking-[0px]">
          {t("homePageConstants.howItWorks")}
        </h2>

        <div className="mb-[28px]">
          <BaseSlider
            items={howItWorksSteps}
            itemClassName="xxs:px-[12px] pb-[20px] mt-[50px]"
            renderItem={(step: HowItWorksStep) => (
              <HowItWorksCard
                imageUrl={step?.imageUrl}
                title={step?.title}
                description={step?.description}
              />
            )}
          />
        </div>

        <div className="flex justify-center">
          <Link href={routePath.createProjectSelectService}>
            <BaseButton
              label={t("homePageConstants.postAProjectFree")}
              className="bg-deepTeal border-none cursor-pointer rounded-[8px] py-[15px] px-[15px] sm:px-[25px] text-textSm md:text-textBase font-medium text-white items-center justify-center xl:leading-[24px] tracking-[0px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;

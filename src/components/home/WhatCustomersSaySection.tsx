import { getTranslationSync } from "@/i18n/i18n";
import TestimonialSlider from "./TestimonialSlider";

export interface Testimonial {
  rating: number;
  text: string;
  name: string;
  date: string;
  imageUrl: string;
}

interface WhatCustomersSaySectionProps {
  testimonials?: Testimonial[];
}

const WhatCustomersSaySection = ({
  testimonials,
}: WhatCustomersSaySectionProps) => {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full mx-auto max-w-container px-[20px] xs:px-[40px] md:px-[80px] desktop:px-[152px]">
        <h2 className="text-titleMid xss:text-titleXl md:text-titleXxlPlus desktop:text-titleXxxl font-bold text-obsidianBlack text-center xl:leading-[100%] tracking-[0px]">
          {t("homePageConstants.whatCustomersSay")}
        </h2>

        <p className="max-w-[700px] text-center text-textBase desktop:text-textLg font-extraLight text-obsidianBlack xl:leading-[32px] tracking-[0px] mx-auto mt-[48px] mb-[40px]">
          {t("homePageConstants.whatCustomersSayDescription")}
        </p>

        <TestimonialSlider testimonials={testimonials ?? []} />
      </div>
    </div>
  );
};

export default WhatCustomersSaySection;

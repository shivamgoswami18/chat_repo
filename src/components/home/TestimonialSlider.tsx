"use client";

import { useState } from "react";
import Image from "next/image";
import BaseSlider from "@/components/base/BaseSlider";
import StarRating from "@/components/common/StarRating";
import { FallBackImage } from "@/assets/icons/CommonIcons";
import type { Testimonial } from "./WhatCustomersSaySection";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const TestimonialSlider = ({ testimonials }: TestimonialSliderProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <BaseSlider
      items={testimonials}
      onItemHover={setHoveredIndex}
      itemClassName="xxs:px-[12px] pb-[20px]"
      renderItem={(testimonial: Testimonial, index: number) => {
        const isHovered = hoveredIndex === index;
        return (
          <div
            className={`bg-white rounded-[16px] p-[10px] md:p-[20px] xl:p-[32px] h-full sm:transition-transform sm:duration-300 ${
              isHovered
                ? "border border-solid border-offWhite sm:shadow-[0px_16px_32px_0px_#108A001A] sm:-translate-y-2"
                : "border border-solid border-offWhite sm:translate-y-0"
            }`}
          >
            <div>
              <StarRating rating={testimonial?.rating} />
            </div>

            <p className="text-textSm md:text-textBase xl:text-textLg font-light text-obsidianBlack xl:leading-[32px] tracking-[0px] mt-[10px] mb-[20px] md:mt-[24px] md:mb-[53px]">
              {testimonial?.text}
            </p>

            <div className="flex items-center gap-[12px]">
              {testimonial?.imageUrl ? (
                <Image
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] rounded-full bg-offWhite flex items-center justify-center">
                  <FallBackImage />
                </div>
              )}
              <div>
                <p className="text-textBase lg:text-textLg font-medium text-obsidianBlack xl:leading-[100%] tracking-[0px]">
                  {testimonial?.name}
                </p>
                <p className="text-textSm lg:text-textBase font-extraLight text-obsidianBlack text-opacity-50 xl:leading-[100%] tracking-[0px]">
                  {testimonial?.date}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default TestimonialSlider;

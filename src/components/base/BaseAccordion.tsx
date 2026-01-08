"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "./BaseButton";

interface BaseAccordionItem {
  question: string;
  answer: string;
}

interface BaseAccordionProps {
  items: BaseAccordionItem[];
  defaultExpandedIndex?: number | null;
  className?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
}

const BaseAccordion = ({
  items,
  defaultExpandedIndex = null,
  className = "",
  itemClassName = "",
  questionClassName = "",
  answerClassName = "",
}: BaseAccordionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    defaultExpandedIndex
  );

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items?.map((item, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className={`rounded-[16px] bg-white border transition-all duration-300 ${
              isExpanded
                ? "bg-white border-0 shadow-[0px_0px_32px_0px_#108A001A]"
                : "bg-white border-0"
            } ${itemClassName}`}
          >
            <BaseButton
              onClick={() => toggleAccordion(index)}
              className={`w-full bg-white flex items-center focus:outline-none focus:ring-0 ${
                isExpanded
                  ? "border-0 rounded-t-[16px]"
                  : "border-[2px] border-solid border-lightGrayAlpha rounded-[16px]"
              } justify-between p-[16px] md:px-[30px] md:py-[20px] text-left`}
              endIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              <span
                className={`text-textBase md:text-textLg font-light text-obsidianBlack xl:leading-[32px] tracking-[0px] ${questionClassName}`}
              >
                {item?.question}
              </span>
            </BaseButton>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`p-[16px] md:px-[30px] md:pb-[20px] ${
                  isExpanded ? "rounded-b-[16px]" : ""
                }`}
              >
                <p
                  className={`text-textSm font-extralight md:text-textBase text-obsidianBlack text-opacity-70 leading-[100%] tracking-[0px] ${answerClassName}`}
                >
                  {item?.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BaseAccordion;

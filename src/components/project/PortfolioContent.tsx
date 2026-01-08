"use client";

import Image from "next/image";
import projectDetailsPortfolioImage from "@/assets/images/project_details_portfolio_project_image.jpg";

export interface PortfolioItem {
  id: number;
  image: string | typeof projectDetailsPortfolioImage;
  tag: string;
  title: string;
  date: string;
  description: string;
}

interface PortfolioContentProps {
  items?: PortfolioItem[];
}

const PortfolioContent = ({
  items = [
    {
      id: 1,
      image: projectDetailsPortfolioImage,
      tag: "Kjøkken",
      title: "Moderne kjøkkenrenovering",
      date: "15. nov. 2025",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      image: projectDetailsPortfolioImage,
      tag: "Møbler",
      title: "Moderne kjøkkenrenovering",
      date: "15. nov. 2025",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 3,
      image: projectDetailsPortfolioImage,
      tag: "Gulv",
      title: "Installasjon av tregulv",
      date: "15. nov. 2025",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 4,
      image: projectDetailsPortfolioImage,
      tag: "Kontor",
      title: "Renovering av hjemmekontor",
      date: "15. nov. 2025",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ],
}: PortfolioContentProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-[16px]">
      {items?.map((item) => (
        <div
          key={item?.id}
          className="bg-white overflow-hidden flex flex-col md:flex-row"
        >
          <div className="relative w-full md:w-[180px] h-[180px] md:h-auto flex-shrink-0">
            <Image
              src={item?.image}
              alt={item?.title}
              fill
              className="object-cover rounded-t-[16px] md:rounded-tr-none md:rounded-l-[16px]"
            />
          </div>
          <div className="p-[10px] sm:px-[16px] sm:py-[18px] flex-1 flex flex-col rounded-b-[16px] md:rounded-bl-none md:rounded-r-[16px] border-t-0 md:border-t-[2px] md:border-l-0 border-[2px] border-solid border-offWhite">
            <div className="flex items-center justify-between">
              <span className="w-fit bg-bluePrimary bg-opacity-15 text-bluePrimary px-[12px] py-[4px] rounded-full text-textSm font-light xl:leading-[100%] xl:tracking-[0px]">
                {item?.tag}
              </span>
              <span className="text-obsidianBlack text-opacity-40 text-mini font-light xl:leading-[100%] xl:tracking-[0px]">
                {item?.date}
              </span>
            </div>
            <h3 className="text-obsidianBlack font-light text-textBase sm:text-textMd mt-[14px] mb-[8px] xl:leading-[100%] xl:tracking-[0px]">
              {item?.title}
            </h3>
            <p className="text-obsidianBlack text-opacity-50 text-textSm xl:leading-[16px] xl:tracking-[0px]">
              {item?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioContent;

import React from "react";
import Image from "next/image";
import { FallBackImage } from "@/assets/icons/CommonIcons";

interface HowItWorksCardProps {
  imageUrl: string;
  title: string;
  description: string;
  isElevated?: boolean;
}

const HowItWorksCard: React.FC<HowItWorksCardProps> = ({
  imageUrl,
  title,
  description,
  isElevated = false,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center text-center ${
        isElevated ? "md:-mt-[70px]" : ""
      }`}
    >
      <div className="relative bg-offWhite rounded-[16px] w-full overflow-visible px-[10px] md:px-[20px] xl:px-[40px] pb-[10px] md:pb-[20px] figmascreen:px-[62px] figmascreen:pb-[33px] pt-[74px]">
        <div className="absolute top-[-40px] xl:top-[-50px] left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-[80px] h-[80px] xl:w-[100px] xl:h-[100px] bg-white rounded-full flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                width={64}
                height={64}
                className="object-cover rounded-full"
              />
            ) : (
              <FallBackImage />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <h3 className="text-textLg desktop:text-titleMid font-medium text-obsidianBlack mb-[15px] xl:leading-[32px] tracking-[0px]">
            {title}
          </h3>
          <p className="max-w-[500px] md:max-w-[287px] text-textBase desktop:text-textLg font-extraLight text-obsidianBlack xl:leading-[32px] tracking-[0px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksCard;

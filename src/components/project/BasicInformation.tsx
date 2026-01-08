import React from "react";
import {
  LocationPinIcon,
  ImagesAttachedIcon,
  DollarIcon,
} from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";
import { getTranslationSync } from "@/i18n/i18n";
import ProjectStatusCard from "./ProjectStatusCard";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";

const t = (key: string, params?: Record<string, string>) =>
  getTranslationSync(key, params);

interface BasicInformationProps {
  isCustomerRole?: boolean;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  isCustomerRole = false,
}) => {
  const currentProjectDetails = useAppSelector(
    (state: RootState) => state.project.currentProjectDetails
  );

  return (
    <div className="flex flex-col lg:flex-row gap-[16px] p-[20px]">
      <div className="w-full lg:w-[70%]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-[10px]">
          <h3 className="text-obsidianBlack text-textMd sm:text-titleMid font-light xl:leading-[100%] xl:tracking-[0px]">
            {currentProjectDetails?.title}
          </h3>

          <span className="px-[12px] bg-bluePrimary text-bluePrimary py-[4px] rounded-[14px] text-textSm font-light xl:leading-[100%] xl:tracking-[0px] inline-block bg-opacity-15 w-fit">
            {currentProjectDetails?.category?.name}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-[10px] mt-[15px] mb-[10px]">
          <div
            className={`w-full ${isCustomerRole ? "sm:w-1/2" : "w-full"} ${
              isCustomerRole ? "lg:max-w-[448px]" : "w-full"
            } bg-mintUltraLight rounded-[8px] p-[12px]`}
          >
            <div className="flex items-center gap-[8px]">
              <div className="bg-white rounded-[6px] px-[13px] py-[11px] flex-shrink-0">
                <LocationPinIcon className="text-obsidianBlack text-opacity-30" />
              </div>
              <div className="flex flex-col gap-[1px] min-w-0">
                <span className="text-obsidianBlack text-textSm text-opacity-40 font-light xl:leading-[100%] xl:tracking-[0px]">
                  {t("projectDetailsPageConstants.infoCardlocationTitle")}
                </span>
                <span className="text-obsidianBlack text-textMd font-light xl:leading-[100%] xl:tracking-[0px] break-words">
                  {currentProjectDetails?.county?.name}
                </span>
              </div>
            </div>
          </div>
          {isCustomerRole && (
            <div className="w-full sm:w-1/2 lg:max-w-[448px] bg-mintUltraLight rounded-[8px] p-[12px]">
              <div className="flex items-center gap-[8px]">
                <div className="bg-white rounded-[6px] px-[13px] py-[11px] flex-shrink-0">
                  <div className="text-obsidianBlack text-opacity-30">
                    <DollarIcon />
                  </div>
                </div>
                <div className="flex flex-col gap-[1px] min-w-0">
                  <span className="text-obsidianBlack text-textSm text-opacity-40 font-light xl:leading-[100%] xl:tracking-[0px]">
                    {t("projectDetailsPageConstants.infoCardContactTitle")}
                  </span>
                  <span className="text-obsidianBlack text-textMd font-light xl:leading-[100%] xl:tracking-[0px] break-words">
                    {currentProjectDetails?.customer?.full_name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full bg-mintUltraLight rounded-[8px] p-[12px]">
          <div className="flex items-end justify-between gap-[8px]">
            <div className="flex items-center gap-[8px] min-w-0">
              <div className="bg-white rounded-[6px] px-[13px] py-[11px] flex-shrink-0">
                <ImagesAttachedIcon className="text-obsidianBlack text-opacity-30" />
              </div>
              <div className="flex flex-col gap-[1px] min-w-0">
                <span className="text-obsidianBlack text-textSm text-opacity-40 font-light xl:leading-[100%] xl:tracking-[0px]">
                  {t("projectDetailsPageConstants.infoCardimagesAttached")}
                </span>
                <span className="text-obsidianBlack text-textMd font-light xl:leading-[100%] xl:tracking-[0px]">
                  {currentProjectDetails?.project_image?.length ?? 0}{" "}
                  {t("projectDetailsPageConstants.images")}
                </span>
              </div>
            </div>
            <div className="flex items-center sm:flex-shrink-0">
              <BaseButton
                label={t("projectDetailsPageConstants.infoCardViewButtonText")}
                className="px-[9px] py-[4px] bg-deepTeal bg-opacity-15 text-deepTeal rounded-[5px] text-mini font-medium border-none xl:leading-[100%] xl:tracking-[0px] whitespace-nowrap"
              />
            </div>
          </div>
        </div>
        <div className="mt-[20px] sm:mt-[30px]">
          <p className="text-obsidianBlack text-textSm sm:text-textBase text-opacity-70 font-light xl:leading-[100%] xl:tracking-[0px]">
            {currentProjectDetails?.description}
          </p>
        </div>
      </div>
      <ProjectStatusCard step={currentProjectDetails?.step ?? 0} />
    </div>
  );
};

export default BasicInformation;

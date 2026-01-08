import { getTranslationSync } from "@/i18n/i18n";
import React, { useMemo } from "react";
import { projectStatusData } from "../constants/Projects";
import { ProjectStatusIcon } from "@/assets/icons/CommonIcons";
const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

interface ProjectStatusCardProps {
  step: number;
}

function ProjectStatusCard({ step }: Readonly<ProjectStatusCardProps>) {
  const statusDataWithCompletion = useMemo(() => {
    return projectStatusData?.map((status) => {
      const isCompleted = status?.id <= step;
      return {
        ...status,
        isCompleted,
      };
    });
  }, [step]);

  return (
    <div className="w-full lg:w-[30%]">
      <div className="bg-mintUltraLight rounded-[16px]">
        <div className="text-obsidianBlack text-textSm sm:text-textBase font-light px-[16px] sm:px-[20px] py-[12px] sm:py-[17px] border-solid border-0 border-b border-white">
          {t("projectDetailsPageConstants.statusCardProjectStatus")}
        </div>

        <ul className="space-y-[20px] sm:space-y-[26px] px-[16px] sm:px-[20px] py-[12px] sm:py-[17px]">
          {statusDataWithCompletion?.map((status, index) => (
            <li
              key={status?.id}
              className="relative flex items-center gap-[10px]"
            >
              {index !== statusDataWithCompletion.length - 1 && (
                <span
                  className={`absolute left-[15px] sm:left-[18px] top-5 h-[40px] sm:h-[50px] w-[3px] ${
                    status?.isCompleted
                      ? "bg-deepTeal"
                      : "bg-deepTeal bg-opacity-10"
                  }`}
                />
              )}

              <div
                className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full z-10 flex-shrink-0 ${
                  status?.isCompleted ? "bg-deepTeal" : "bg-white"
                }`}
              >
                <ProjectStatusIcon
                  stroke={status?.isCompleted ? "white" : "black"}
                />
              </div>

              <div className="min-w-0">
                <div className="text-textSm sm:text-textBase font-light text-obsidianBlack mb-[2px]">
                  {t(status?.translationKey)}
                </div>
                <div className="text-mini text-opacity-40 font-light text-obsidianBlack">
                  {status?.isCompleted
                    ? t("projectDetailsPageConstants.completed")
                    : t("projectDetailsPageConstants.pending")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectStatusCard;

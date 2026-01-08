"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  valuePostfix?: ReactNode;
}

const StatCard = ({ label, value, icon, valuePostfix }: StatCardProps) => {
  return (
    <div className="bg-mintUltraLight flex items-center gap-[8px] rounded-[8px] p-[12px]">
      <div className="flex items-center bg-white p-[13px] rounded-[6px]">
        {icon}
      </div>
      <div className="flex flex-col gap-[4px]">
        <span className="text-obsidianBlack text-textSm font-light xl:leading-[100%] xl:tracking-[0px] text-opacity-40">
          {label}
        </span>
        <span className="text-obsidianBlack flex items-center gap-[3px] text-textMd font-light xl:leading-[100%] xl:tracking-[0px]">
          {value}
          {valuePostfix && <span>{valuePostfix}</span>}
        </span>
      </div>
    </div>
  );
};

export default StatCard;

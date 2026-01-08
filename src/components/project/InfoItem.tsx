import { ReactNode } from "react";

interface InfoItemProps {
  icon: ReactNode;
  text: string;
}

const InfoItem = ({ icon, text }: InfoItemProps) => {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="opacity-30 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-obsidianBlack text-opacity-50 text-textMd font-light xl:leading-[100%] xl:tracking-[0px]">
        {text}
      </span>
    </div>
  );
};

export default InfoItem;

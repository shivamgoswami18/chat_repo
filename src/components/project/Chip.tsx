import { CrossIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";

interface ChipProps {
  label: string;
  color: string;
  onRemove?: () => void;
}

const colorClasses: Record<string, { bg: string; text: string }> = {
  bluePrimary: {
    bg: "bg-bluePrimary",
    text: "text-bluePrimary",
  },
  orangeAccent: {
    bg: "bg-orangeAccent",
    text: "text-orangeAccent",
  },
};

const Chip = ({ label, color, onRemove }: ChipProps) => {
  const colorClass = colorClasses[color];

  return (
    <span
      className={`px-[10px] py-[5px] rounded-[8px] text-textSm font-light xl:leading-[100%] xl:tracking-[0px] inline-block ${colorClass.bg} bg-opacity-10 ${colorClass.text}`}
    >
      <span className="align-middle"> {label} </span>
      {onRemove && (
        <BaseButton
          type="button"
          onClick={onRemove}
          className="cursor-pointer border-0 align-middle justify-center bg-transparent"
        >
          <CrossIcon />
        </BaseButton>
      )}
    </span>
  );
};

export default Chip;

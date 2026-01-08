import BaseButton from "@/components/base/BaseButton";
import BaseModal from "@/components/base/BaseModal";

export default function SelectItem({
  visible,
  title,
  items,
  selected,
  onSelect,
  onHide,
}: {
  visible: boolean;
  title: string;
  items: string[];
  selected: string[];
  onSelect: (item: string) => void;
  onHide: () => void;
}) {
  return (
    <BaseModal
      visible={visible}
      onHide={onHide}
      header={title}
      headerClassName="px-[20px] py-[16px]"
      maxWidth="28rem"
      showCloseIcon
    >
      <div className="flex flex-wrap gap-2 p-[20px]">
        {items?.map((item) => {
          const isSelected = selected.includes(item);

          return (
            <BaseButton
              key={item}
              disabled={isSelected}
              onClick={() => {
                onSelect(item);
                onHide();
              }}
              className={`px-3 py-1 rounded-full text-textSm border transition border-0",
                ${
                  isSelected
                    ? "text-obsidianBlack text-opacity-25 bg-grayDelta cursor-not-allowed border-deepTeal"
                    : "bg-deepTeal text-white border-0"
                }`}
            >
              {item}
            </BaseButton>
          );
        })}
      </div>
    </BaseModal>
  );
}

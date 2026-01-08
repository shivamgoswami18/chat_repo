"use client";
import { useEffect, useState } from "react";
import Chip from "../project/Chip";
import SelectItem from "./SelectItem";
import BaseButton from "../base/BaseButton";
import { CreateProjectPlusIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import { fetchCounties } from "@/lib/api/AuthApi";
import { County } from "@/types/profile";

type AreaModalProps = {
  value: string[];
  onChange: (areas: string[]) => void;
};
function AreaModal({ value, onChange }: AreaModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [counties, setCounties] = useState<Array<{value: string; label: string}>>([]);
  
  useEffect(() => {
    const loadCounties = async () => {
      const data = await fetchCounties() as County[];
      setCounties(data?.map((county: County) => ({ value: county._id, label: county.name })));
    };
    loadCounties();
  }, []);

  const handleSelectArea = (areaName: string) => {
    const countyId = counties.find((c) => c.label === areaName)?.value;
    if (!countyId) return;

    if (!value.includes(countyId)) {
      onChange([...value, countyId]);
    }
    setShowModal(false);
  };

  const handleRemoveArea = (area: string) => {
    onChange(value?.filter((a) => a !== area));
  };

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  const getCountyName = (id: string) => {
    return counties.find((c) => c.value === id)?.label ?? id;
  };
  return (
    <div className="mt-[16px]">
      <div className="flex flex-wrap gap-[6px] mb-[6px]">
        {value?.map((service) => (
          <Chip
            key={service}
            label={getCountyName(service)}
            color="orangeAccent"
            onRemove={() => handleRemoveArea(service)}
          />
        ))}
      </div>
      <SelectItem
        visible={showModal}
        title={t("profilePageConstants.selectArea")}
        items={counties?.map((item) => item.label)}
        selected={value?.map((id) => getCountyName(id))}
        onSelect={handleSelectArea}
        onHide={() => setShowModal(false)}
      />
      <BaseButton
        label={t("profilePageConstants.addArea")}
        startIcon={<CreateProjectPlusIcon />}
        onClick={() => setShowModal(true)}
        className="border border-obsidianBlack border-opacity-10 bg-white text-obsidianBlack pl-[5px] pr-[10px] py-[5px] text-opacity-50 rounded-[8px]"
      />
    </div>
  );
}

export default AreaModal;

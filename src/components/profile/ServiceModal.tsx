"use client";

import { ListOfService } from "@/lib/api/ProjectApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import React, { useEffect, useState } from "react";
import Chip from "@/components/project/Chip";
import SelectItem from "@/components/profile/SelectItem";
import BaseButton from "@/components/base/BaseButton";
import { CreateProjectPlusIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";

interface ServiceItem {
  _id: string;
  name: string;
}

interface ServicesResponse {
  items: ServiceItem[];
}

interface ServiceModalProps {
  value: string[];
  onChange: (services: string[]) => void;
}

function ServiceModal({ value, onChange }: ServiceModalProps) {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);

  const services = useAppSelector((state) => state.project.services) as
    | ServicesResponse
    | undefined;

  useEffect(() => {
    dispatch(
      ListOfService({
        payload: {
          limit: 100000,
        },
      })
    );
  }, [dispatch]);

  const handleSelectService = (serviceName: string) => {
    const serviceId = services?.items?.find((s) => s.name === serviceName)?._id;
    if (!serviceId) return;

    if (!value.includes(serviceId)) {
      onChange([...value, serviceId]);
    }
    setShowModal(false);
  };

  const handleRemoveService = (service: string) => {
    onChange(value?.filter((s) => s !== service));
  };

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };

  const getServiceName = (id: string) => {
    return services?.items?.find((s) => s._id === id)?.name ?? id;
  };

  return (
    <div className="mt-[16px]">
      <div className="flex flex-wrap gap-[6px] mb-[6px]">
        {value?.map((service) => (
          <Chip
            key={service}
            label={getServiceName(service)}
            color="bluePrimary"
            onRemove={() => handleRemoveService(service)}
          />
        ))}
      </div>
      <SelectItem
        visible={showModal}
        title={t("profilePageConstants.selectService")}
        items={services?.items?.map((s) => s.name) ?? []}
        selected={value?.map((id) => getServiceName(id))}
        onSelect={handleSelectService}
        onHide={() => setShowModal(false)}
      />
      <BaseButton
        label={t("profilePageConstants.addService")}
        startIcon={<CreateProjectPlusIcon />}
        onClick={() => setShowModal(true)}
        className="border border-obsidianBlack border-opacity-10 bg-white text-obsidianBlack pl-[5px] pr-[10px] py-[5px] text-opacity-50 rounded-[8px]"
      />
    </div>
  );
}

export default ServiceModal;

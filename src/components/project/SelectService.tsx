"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BaseButton from "@/components/base/BaseButton";
import BaseLoader from "@/components/base/BaseLoader";
import { NextArrowIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import { routePath } from "@/components/constants/RoutePath";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ListOfService } from "@/lib/api/ProjectApi";
import {
  setSelectedCategory,
  setServiceSelectionData,
} from "@/lib/store/slices/projectSlice";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

export default function SelectService() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const serviceItems = useAppSelector(
    (state) => state?.project?.services?.items ?? []
  );
  const loadingServices = useAppSelector(
    (state) => state?.project?.loadingServices ?? false
  );
  const serviceSelectionData = useAppSelector(
    (state) => state?.project?.serviceSelectionData
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    serviceSelectionData?.selectedServiceId ?? serviceItems[0]?._id ?? ""
  );
  const [selectedTypeOfWorkId, setSelectedTypeOfWorkId] = useState<string>(
    serviceSelectionData?.selectedTypeOfWorkId ?? ""
  );

  const handleSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  useEffect(() => {
    dispatch(
      ListOfService({
        payload: {
          limit: 100000,
        },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (serviceSelectionData?.selectedServiceId) {
      setSelectedServiceId(serviceSelectionData.selectedServiceId);
    }
    if (serviceSelectionData?.selectedTypeOfWorkId) {
      setSelectedTypeOfWorkId(serviceSelectionData.selectedTypeOfWorkId);
    }
  }, [serviceSelectionData]);

  const selectedService = serviceItems.find(
    (service) => service?._id === selectedServiceId
  );
  const typeOfWorks = selectedService?.type_of_work ?? [];
  const hasTypeOfWork = typeOfWorks?.length > 0;

  const handleSelectTypeOfWork = (typeOfWorkId: string) => {
    setSelectedTypeOfWorkId(typeOfWorkId);
  };

  const handleNext = () => {
    const selectedService = serviceItems.find(
      (service) => service?._id === selectedServiceId
    );
    if (selectedService) {
      dispatch(setSelectedCategory(selectedService));
      dispatch(
        setServiceSelectionData({
          selectedServiceId: selectedServiceId ?? "",
          selectedTypeOfWorkId: selectedTypeOfWorkId ?? "",
        })
      );
      router.push(routePath.createProjectProjectDescription);
    }
  };

  return (
    <>
      <div className="rounded-[16px] bg-white shadow-[0px_8px_16px_0px_#108A0008]">
        <p className="border-0 border-solid border-b border-graySoft border-opacity-40 px-[20px] py-[18px] text-textLg text-obsidianBlack xl:leading-[100%] xl:tracking-[0px]">
          {t("createProjectPageConstants.selectServiceCategory")}
        </p>

        <div className="grid grid-cols-1 gap-[14px] px-[20px] pt-[24px] pb-[29px] sm:grid-cols-2 lg:grid-cols-3">
          {loadingServices ? (
            <div className="col-span-full flex justify-center items-center py-[60px]">
              <BaseLoader size="lg" />
            </div>
          ) : (
            serviceItems?.map((service) => {
              const isActive = selectedServiceId === service?._id;
              return (
                <BaseButton
                  key={service?._id}
                  type="button"
                  onClick={() => {
                    handleSelect(service?._id ?? "");
                    setSelectedTypeOfWorkId("");
                  }}
                  className={`w-full rounded-[8px] border py-[19px] figmascreen:px-[96px] text-textMd transition xl:leading-[100%] xl:tracking-[0px] ${
                    isActive
                      ? "border-deepTeal border-opacity-50 bg-deepTeal bg-opacity-10 text-deepTeal border-2"
                      : "border-lightGrayAlpha border-2 text-obsidianBlack bg-white"
                  }`}
                >
                  {service?.name}
                </BaseButton>
              );
            })
          )}
        </div>
        {hasTypeOfWork && !loadingServices && (
          <div className="px-[20px] pb-[29px]">
            <p className="text-textBase font-light text-obsidianBlack mb-[16px] xl:leading-[20px] xl:tracking-[0%]">
              {t("createProjectPageConstants.selectTypeOfWork")}
            </p>
            <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
              {typeOfWorks?.map((typeOfWork) => {
                const isActive = selectedTypeOfWorkId === typeOfWork?._id;
                return (
                  <BaseButton
                    key={typeOfWork?._id}
                    type="button"
                    onClick={() =>
                      handleSelectTypeOfWork(typeOfWork?._id ?? "")
                    }
                    className={`w-full rounded-[8px] border py-[19px] figmascreen:px-[96px] text-textMd transition xl:leading-[100%] xl:tracking-[0px] ${
                      isActive
                        ? "border-deepTeal border-opacity-50 bg-deepTeal bg-opacity-10 text-deepTeal border-2"
                        : "border-lightGrayAlpha border-2 text-obsidianBlack bg-white"
                    }`}
                  >
                    {typeOfWork?.name}
                  </BaseButton>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="mt-[24px] flex justify-end px-[20px]">
        <BaseButton
          label={t("commonConstants.next")}
          onClick={handleNext}
          className="px-[24px] py-[10px] bg-deepTeal rounded-[8px] xl:leading-[100%] xl:tracking-[0px] border-0"
          endIcon={<NextArrowIcon />}
        />
      </div>
    </>
  );
}

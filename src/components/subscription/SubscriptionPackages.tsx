"use client";

import React, { useEffect, useState } from "react";
import {
  SubscriptionChipIcon,
  SubscriptionChipCheckedIcon,
} from "@/assets/icons/CommonIcons";
import BaseCheckbox from "../base/BaseCheckbox";
import BaseButton from "../base/BaseButton";
import { commonLabels } from "../constants/Common";
import { getTranslationSync } from "@/i18n/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  listOfSubscriptions,
  sendPlanRequest,
} from "@/lib/api/SubscriptionApi";
import { toast } from "react-toastify";
import { clearSuccess, clearError } from "@/lib/store/slices/subscriptionSlice";
import { ViewProfile } from "@/lib/api/UserApi";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

const SubscriptionPackages = () => {
  const dispatch = useAppDispatch();
  const subscriptions = useAppSelector(
    (state) => state.subscription.subscriptions
  );
  const user = useAppSelector((state) => state.user.profile);
  const successMessage = useAppSelector((state) => state.subscription.success);
  const errorMessage = useAppSelector((state) => state.subscription.error);

  useEffect(() => {
    dispatch(
      listOfSubscriptions({
        payload: {
          status: "pending",
        },
      })
    );
    dispatch(ViewProfile());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearError());
    }
  }, [errorMessage, dispatch]);

  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const handleSendRequest = () => {
    if (!selectedPackage) return;
    dispatch(sendPlanRequest(selectedPackage));
  };
  return (
    <div className="bg-white rounded-[16px] shadow-[0px_8px_16px_0px_#108A0008] p-[20px] w-full md:w-[550px] lg:w-[600px] desktop:w-[650px]">
      <div className="bg-deepTeal bg-opacity-5 px-[20px] py-[16px] flex justify-between items-center gap-[20px] flex-wrap rounded-[16px] mb-[30px]">
        <div>
          <p className="text-obsidianBlack text-opacity-70 text-textSm xl:leading-[100%] xl:tacking-[0px] ">
            {t("subscriptionPageConstants.currentBalance")}
          </p>
          <p className="mt-[6px] font-medium desktop:text-titleLg md:text-titleMd xl:leading-[100%] xl:tracking-[0px] text-obsidianBlack">
            {user?.total_clips}{" "}
            {t("subscriptionPageConstants.clips")}
          </p>
        </div>
        <SubscriptionChipIcon />
      </div>
      <div className="mb-[12px]">
        <p className="text-obsidianBlack text-opacity-40 text-textSm font-light xl:leading-[100%] xl:tacking-[0px]">
          {t("subscriptionPageConstants.choosePackage")}
        </p>
      </div>
      <div className="bg-white border-solid border-2 overflow-hidden border-offWhite rounded-[16px]">
        {subscriptions?.items?.map((pkg) => (
          <div
            key={pkg?._id}
            className={`${
              selectedPackage === pkg?._id
                ? "bg-deepTeal bg-opacity-5"
                : "bg-white"
            }`}
          >
            <div className="mx-[20px] py-[20px] flex justify-between items-center border-solid border-0 border-b border-graySoft border-opacity-50">
              <div className="flex gap-[14px]">
                <BaseCheckbox
                  name={`package-${pkg?._id}`}
                  checked={selectedPackage === pkg?._id}
                  onChange={(checked) =>
                    setSelectedPackage(checked ? pkg?._id ?? "" : "")
                  }
                  checkboxClassName="border-2 border-offWhite"
                />

                <div className="flex gap-[6px] items-start">
                  <SubscriptionChipCheckedIcon />
                  <div>
                    <p className="text-obsidianBlack text-textBase font-light mb-[2px] xl:leading-[100%] xl:tracking-[0px]">
                      {pkg?.package_name} {t("subscriptionPageConstants.clips")}
                    </p>
                    <p className="text-mini font-light text-obsidianBlack text-opacity-50 xl:leading-[100%] xl:tracking-[0px]">
                      {commonLabels?.dollar}
                      {pkg?.monthly_duration}{" "}
                      {t("subscriptionPageConstants.perClip")}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-deepTeal text-textBase font-medium xl:leading-[100%] xl:tracking-[0px]">
                {commonLabels?.dollar}
                {pkg?.price}
              </p>
            </div>
          </div>
        ))}
        <div className="px-[20px] pt-[16px] pb-[20px] text-right">
          <BaseButton
            onClick={handleSendRequest}
            disabled={!selectedPackage}
            label={t("subscriptionPageConstants.sendRequestButtonText")}
            className="bg-deepTeal rounded-[8px] px-[26px] py-[10px] text-textSm font-medium border-0 xl:leading-[100%] xl:tracking-[0px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPackages;

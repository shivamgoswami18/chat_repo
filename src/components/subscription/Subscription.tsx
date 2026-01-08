"use client";
import { BackArrowIcon } from "@/assets/icons/CommonIcons";
import { getTranslationSync } from "@/i18n/i18n";
import { commonLabels } from "../constants/Common";
import SubscriptionPackages from "./SubscriptionPackages";
import BaseButton from "../base/BaseButton";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import { clipHistory } from "@/lib/api/SubscriptionApi";
import { formatDateTime } from "@/components/constants/Validation";

function Subscription() {
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslationSync(key, params);
  };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const clipUsageHistoryData = useAppSelector(
    (state) => state.subscription.clipHistory
  );
  useEffect(() => {
    dispatch(
      clipHistory({
        payload: {
          status: "pending",
        },
      })
    );
  }, [dispatch]);
  return (
    <div>
      <div className="flex gap-[10px] items-center">
        <BaseButton
          className="bg-transparent border-none p-0"
          onClick={() => router.back()}
        >
          <BackArrowIcon size={24} />
        </BaseButton>
        <p className="text-obsidianBlack text-titleMid font-light xl:leading-[100%] xl:tracking-[0px]">
          {t("subscriptionPageConstants.subscriptionHeader")}
        </p>
      </div>
      <div className="mt-[20px] flex gap-[24px] flex-col md:flex-row">
        <SubscriptionPackages />
        <div className="bg-white rounded-[16px] border-solid border-2 border-offWhite w-full md:w-[500px] lg:w-[550px] desktop:w-[600px]">
          <div className="border-solid border-b border-0 border-graySoft border-opacity-50 p-[20px]">
            <p className="text-titleMid font-light text-obsidianBlack xl:leading-[100%] xl:tracking-[0px]">
              {t("subscriptionPageConstants.clipUsageHistory")}
            </p>
          </div>
          <div className="px-[20px]">
            {clipUsageHistoryData?.items?.length ? (
              clipUsageHistoryData?.items?.map((item, index) => {
                const isLastItem =
                  index === clipUsageHistoryData?.items?.length - 1;

                return (
                  <div
                    key={item?._id}
                    className={`py-[16px] flex justify-between ${
                      isLastItem
                        ? ""
                        : "border-solid border-0 border-b border-graySoft border-opacity-50"
                    }`}
                  >
                    <div>
                      <p className="text-obsidianBlack font-light text-textBase xl:leading-[100%] xl:tracking-[0px]">
                        {item?.project_title}
                      </p>

                      <p className="mt-[2px] text-obsidianBlack text-opacity-50 text-mini xl:leading-[100%] xl:tracking-[0px] font-light">
                        {item?.createdAt ? formatDateTime(item.createdAt) : "-"}
                      </p>

                      <div
                        className={`mt-[3px] inline-flex items-center justify-center rounded-[14px] px-[12px] py-[4px] text-mini xl:leading-[100%] xl:tracking-[0px] font-light ${
                          item?.usage_type === commonLabels?.purchased
                            ? "bg-deepTeal bg-opacity-5 text-deepTeal"
                            : "bg-vividBlue bg-opacity-5 text-vividBlue"
                        }`}
                      >
                        {item?.usage_type}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-textBase xl:leading-[100%] xl:tracking-[0px] font-light mb-[2px] ${
                          (item?.clips_used ?? 0) > 0
                            ? "text-deepTeal"
                            : "text-redPrimary"
                        }`}
                      >
                        {(item?.clips_used ?? 0) > 0
                          ? `+${item.clips_used}`
                          : item.clips_used}
                      </p>

                      <p className="text-obsidianBlack text-opacity-50 text-mini xl:leading-[100%] xl:tracking-[0px]">
                        {t("subscriptionPageConstants.clips")}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-[20px] text-center text-obsidianBlack text-opacity-50 text-textBase">
                {t("baseTableConstants.noRecordsFound")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;

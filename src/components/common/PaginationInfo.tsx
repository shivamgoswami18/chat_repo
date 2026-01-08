"use client";
import React from "react";
import BaseButton from "../base/BaseButton";
import { getTranslationSync } from "@/i18n/i18n";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};

interface PaginationInfoProps {
  currentCount: number;
  totalCount: number;
  itemLabel: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  className?: string;
  buttonClassName?: string;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentCount,
  totalCount,
  itemLabel,
  onLoadMore,
  isLoadingMore = false,
  className = "",
  buttonClassName = "",
}) => {
  if (currentCount === 0) {
    return null;
  }
  const hasMore = currentCount < totalCount;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="font-light text-textSm mb-[10px] xl:leading-[100%] xl:tracking-[-0.03rem] text-obsidianBlack text-opacity-70">
        {t("commonConstants.showing")} {currentCount} {t("commonConstants.of")}{" "}
        {totalCount} {itemLabel}
      </span>
      {hasMore && onLoadMore && (
        <BaseButton
          label={t("commonConstants.loadMore")}
          className={`min-w-[128px] max-h-[47px] flex items-center justify-center bg-white rounded-[8px] px-[20px] py-[14px] !text-black font-medium text-textSm xl:leading-[140%] xl:tracking-[-0.01rem] border-[2px] border-obsidianBlack border-opacity-10 hover:border-opacity-20 ${buttonClassName}`}
          onClick={onLoadMore}
          loader={isLoadingMore}
        />
      )}
    </div>
  );
};

export default PaginationInfo;

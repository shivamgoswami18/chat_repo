"use client";

import React from "react";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";

interface BaseProgressBarProps {
  percentage: number;
  className?: string;
  barClassName?: string;
  containerClassName?: string;
}

const BaseProgressBar: React.FC<BaseProgressBarProps> = ({
  percentage,
  className = "",
  barClassName = "",
  containerClassName = "",
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={classNames("flex-1", containerClassName, className)}>
      <ProgressBar
        value={clampedPercentage}
        className={classNames(
          "h-[6px]",
          "[&_.p-progressbar]:bg-lightGrayAlpha",
          "[&_.p-progressbar]:rounded-full",
          "[&_.p-progressbar-value]:bg-yellowPrimary",
          "[&_.p-progressbar-value]:rounded-full",
          "[&_.p-progressbar-value]:transition-all",
          barClassName
        )}
        showValue={false}
      />
    </div>
  );
};

export default BaseProgressBar;

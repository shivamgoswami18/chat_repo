"use client";

import React from "react";
import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";

type SkeletonShape = "rectangle" | "circle" | "square";
type SkeletonAnimation = "wave" | "none";

interface BaseSkeletonProps {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animation?: SkeletonAnimation;
  className?: string;
  count?: number;
  gap?: string;
  direction?: "row" | "column";
}

interface BaseSkeletonCardProps {
  showAvatar?: boolean;
  avatarSize?: string;
  lines?: number;
  showActions?: boolean;
  actionCount?: number;
  className?: string;
}

interface BaseSkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

interface BaseSkeletonProfileProps {
  avatarSize?: string;
  lines?: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

interface BaseSkeletonPopupProps {
  showHeader?: boolean;
  contentLines?: number;
  showFooter?: boolean;
  footerButtons?: number;
  className?: string;
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({
  shape = "rectangle",
  width = "100%",
  height = "1rem",
  borderRadius = "8px",
  animation = "wave",
  className = "",
  count = 1,
  gap = "0.5rem",
  direction = "column",
}) => {
  const skeletonShape = shape === "square" ? "rectangle" : shape;
  
  const skeletonStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: skeletonShape === "rectangle" ? borderRadius : undefined,
  };

  if (count === 1) {
    return (
      <Skeleton
        shape={skeletonShape}
        style={skeletonStyle}
        animation={animation}
        className={classNames("bg-lightGrayGamma", className)}
      />
    );
  }

  const containerStyle = {
    display: "flex",
    flexDirection: direction,
    gap,
  };

  return (
    <div style={containerStyle}>
      {Array?.from({ length: count })?.map((_, index) => (
        <Skeleton
          key={index}
          shape={skeletonShape}
          style={skeletonStyle}
          animation={animation}
          className={classNames("bg-lightGrayGamma", className)}
        />
      ))}
    </div>
  );
};

export const BaseSkeletonCard: React.FC<BaseSkeletonCardProps> = ({
  showAvatar = true,
  avatarSize = "3rem",
  lines = 3,
  showActions = true,
  actionCount = 2,
  className = "",
}) => {
  return (
    <div
      className={classNames(
        "border border-lightGrayGamma rounded-[8px] p-4 bg-white",
        className
      )}
    >
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <BaseSkeleton
            shape="circle"
            width={avatarSize}
            height={avatarSize}
          />
          <div className="flex-1">
            <BaseSkeleton width="60%" height="1rem" className="mb-2" />
            <BaseSkeleton width="40%" height="0.75rem" />
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {Array?.from({ length: lines })?.map((_, index) => (
          <BaseSkeleton
            key={index}
            width={index === lines - 1 ? "70%" : "100%"}
            height="0.875rem"
          />
        ))}
      </div>

      {showActions && (
        <div className="flex gap-2">
        {Array?.from({ length: actionCount })?.map((_, index) => (
            <BaseSkeleton
              key={index}
              width="6rem"
              height="2.5rem"
              borderRadius="6px"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const BaseSkeletonTable: React.FC<BaseSkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = "",
}) => {
  return (
    <div
      className={classNames(
        "border border-lightGrayGamma rounded-[8px] overflow-hidden bg-white",
        className
      )}
    >
      {showHeader && (
        <div className="bg-offWhite border-b border-lightGrayGamma p-4">
          <div className="flex gap-4">
            {Array?.from({ length: columns })?.map((_, index) => (
              <div key={index} className="flex-1">
                <BaseSkeleton width="80%" height="1rem" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {Array?.from({ length: rows })?.map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="border-b border-lightGrayGamma last:border-b-0 p-4"
          >
            <div className="flex gap-4">
              {Array?.from({ length: columns })?.map((_, colIndex) => (
                <div key={colIndex} className="flex-1">
                  <BaseSkeleton width="90%" height="0.875rem" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BaseSkeletonProfile: React.FC<BaseSkeletonProfileProps> = ({
  avatarSize = "5rem",
  lines = 4,
  className = "",
  orientation = "horizontal",
}) => {
  if (orientation === "vertical") {
    return (
      <div className={classNames("text-center", className)}>
        <div className="flex justify-center mb-4">
          <BaseSkeleton
            shape="circle"
            width={avatarSize}
            height={avatarSize}
          />
        </div>
        <div className="space-y-2">
          {Array?.from({ length: lines })?.map((_, index) => (
            <div key={index} className="flex justify-center">
              <BaseSkeleton
                width={index === 0 ? "60%" : "40%"}
                height={index === 0 ? "1.25rem" : "0.875rem"}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={classNames("flex items-center gap-4", className)}>
      <BaseSkeleton
        shape="circle"
        width={avatarSize}
        height={avatarSize}
      />
      <div className="flex-1 space-y-2">
        {Array?.from({ length: lines })?.map((_, index) => (
          <BaseSkeleton
            key={index}
            width={index === 0 ? "70%" : "50%"}
            height={index === 0 ? "1.25rem" : "0.875rem"}
          />
        ))}
      </div>
    </div>
  );
};

export const BaseSkeletonPopup: React.FC<BaseSkeletonPopupProps> = ({
  showHeader = true,
  contentLines = 5,
  showFooter = true,
  footerButtons = 2,
  className = "",
}) => {
  return (
    <div
      className={classNames(
        "border border-lightGrayGamma rounded-[8px] bg-white",
        className
      )}
    >
      {showHeader && (
        <div className="border-b border-lightGrayGamma p-4">
          <BaseSkeleton width="40%" height="1.25rem" />
        </div>
      )}

      <div className="p-4 space-y-3">
        {Array?.from({ length: contentLines })?.map((_, index) => (
          <BaseSkeleton
            key={index}
            width={index === contentLines - 1 ? "80%" : "100%"}
            height="0.875rem"
          />
        ))}
      </div>

      {showFooter && (
        <div className="border-t border-lightGrayGamma p-4 flex justify-end gap-2">
          {Array?.from({ length: footerButtons })?.map((_, index) => (
            <BaseSkeleton
              key={index}
              width="6rem"
              height="2.5rem"
              borderRadius="6px"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BaseSkeleton;
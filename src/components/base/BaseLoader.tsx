"use client";

import React from "react";
import { FaSpinner } from "react-icons/fa";
import { classNames } from "primereact/utils";

interface BaseLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
}

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

const BaseLoader: React.FC<BaseLoaderProps> = ({
  className = "",
  size = "lg",
  color = "text-obsidianBlack",
}) => {
  return (
    <FaSpinner
      className={classNames(
        "animate-spin",
        sizeClasses[size],
        color,
        className
      )}
    />
  );
};

export default BaseLoader;

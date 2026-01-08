"use client";
import React from "react";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { FaSpinner } from "react-icons/fa";
 
interface BaseButtonProps {
  label?: string;
  type?: "button" | "reset" | "submit";
  children?: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loader?: boolean;
  dataTest?: string;
}
 
const BaseButton: React.FC<BaseButtonProps> = ({
  label,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  startIcon,
  endIcon,
  loader = false,
  children,
  dataTest,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loader}
      data-testid={dataTest}
      className={classNames(
        "inline-flex items-center justify-center gap-1 focus:ring-0",
        className
      )}
    >
      {loader ? (
        <FaSpinner className="animate-spin text-base" />
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {label ?? children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </Button>
  );
};
 
export default BaseButton;

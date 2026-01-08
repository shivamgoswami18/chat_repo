"use client";

import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface BaseDropdownProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  label?: string;
  name?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value?: string;
  handleBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  touched?: boolean;
  labelClassName?: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
  endIcon?: React.ReactNode;
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  className,
  disabled,
  error,
  fullWidth,
  name,
  onChange,
  placeholder,
  label,
  required,
  value,
  handleBlur,
  touched,
  labelClassName,
  icon,
  options,
  endIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: DropdownChangeEvent) => {
    onChange?.(e.value);
  };

  return (
    <div className={`${fullWidth ? "w-full" : ""} text-start`}>
      {label && (
        <label htmlFor={name} className={`${labelClassName} block`}>
          {label}
          {required && <span className="text-black">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none">
            {icon}
          </span>
        )}
        <Dropdown
          id={name}
          name={name}
          value={value || null}
          options={options}
          optionLabel="label"
          optionValue="value"
          onChange={handleChange}
          onBlur={handleBlur}
          onShow={() => setIsOpen(true)}
          onHide={() => setIsOpen(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${className} ${
            error && touched ? "!border-red-500" : ""
          } ${
            icon ? "pl-[38px]" : "pl-[14px]"
          } pr-[38px] [&.p-focus]:ring-0 [&.p-focus]:outline-none [&.p-focus]:border-lightGrayGamma [&.p-focus]:shadow-none`}
          panelClassName="!border-lightGrayGamma !rounded-[8px] !shadow-lg"
          itemTemplate={(option) => (
            <div className="px-[14px] py-[2px]">
              <span className="text-obsidianBlack text-textBase font-light xl:leading-[20px] xl:tracking-[0%]">
                {option.label}
              </span>
            </div>
          )}
          valueTemplate={(option) => {
            if (option) {
              return (
                <span className="text-obsidianBlack text-textBase font-light xl:leading-[20px] xl:tracking-[0%]">
                  {option.label}
                </span>
              );
            }
            return (
              <span className="text-obsidianBlack text-opacity-30 text-textSm font-light xl:leading-[20px] xl:tracking-[0%]">
                {placeholder}
              </span>
            );
          }}
          pt={{
            root: {
              className: `font-light text-textBase text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 focus:outline-none focus:border-lightGrayGamma focus:shadow-none ${
                error && touched ? "!border-red-500" : ""
              }`,
            },
            input: {
              className:
                "w-full text-obsidianBlack text-textBase font-light xl:leading-[20px] xl:tracking-[0%]",
            },
            panel: {
              className: "!border-lightGrayGamma !rounded-[8px] !shadow-lg",
            },
            list: {
              className: "py-0",
            },
            item: ({ context }: { context: { selected: boolean } }) => ({
              className: `px-[14px] py-[12px] ${
                context.selected ? "bg-offWhite" : ""
              } hover:bg-offWhite`,
            }),
            trigger: {
              className: "!w-[20px] !h-[20px] !opacity-0 !pointer-events-auto",
            },
            clearIcon: {
              className: "!hidden",
            },
          }}
        />
        {endIcon && (
          <span
            className={`absolute right-[14px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            {endIcon}
          </span>
        )}
      </div>

      {error && touched && (
        <small id={`error-${name}`} className="p-error text-[12px]">
          {error}
        </small>
      )}
    </div>
  );
};

export default BaseDropdown;

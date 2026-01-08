"use client";

import React, { useState, useEffect, useRef } from "react";
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteChangeEvent } from "primereact/autocomplete";
import { FaSpinner } from "react-icons/fa";

export interface SuggestionItem {
  value: string;
  label: string;
  [key: string]: string | number | boolean | undefined;
}

interface BaseSearchOptionsProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  label?: string;
  name?: string;
  onChange?: (value: string) => void;
  onSelect?: (item: SuggestionItem) => void;
  placeholder?: string;
  required?: boolean;
  value?: string;
  handleBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  touched?: boolean;
  labelClassName?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onSearch?: (query: string) => Promise<void> | void;
  suggestions?: SuggestionItem[];
  loading?: boolean;
  debounceDelay?: number;
  itemTemplate?: (item: SuggestionItem) => React.ReactNode;
  minSearchLength?: number;
}

const BaseSearchOptions: React.FC<BaseSearchOptionsProps> = ({
  className,
  disabled,
  error,
  fullWidth,
  name,
  onChange,
  onSelect,
  placeholder,
  label,
  required,
  value,
  handleBlur,
  touched,
  labelClassName,
  icon,
  endIcon,
  onSearch,
  suggestions = [],
  loading = false,
  debounceDelay = 500,
  itemTemplate,
  minSearchLength = 2,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<SuggestionItem[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (suggestions) {
      setFilteredSuggestions(suggestions);
    }
  }, [suggestions]);

  const handleAutoCompleteChange = (e: AutoCompleteChangeEvent) => {
    const newValue = typeof e.value === 'string' ? e.value : e.value?.label || e.value?.value || '';
    onChange?.(newValue);
    
    if (typeof e.value === 'object' && e.value !== null) {
      onSelect?.(e.value);
    }
  };

  const handleSearch = (event: AutoCompleteCompleteEvent) => {
    const query = event.query;

    if (!query || query.trim().length < minSearchLength) {
      setFilteredSuggestions([]);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, debounceDelay);
  };

  const defaultItemTemplate = (option: SuggestionItem) => (
    <div className="px-[14px] py-[2px]">
      <span className="text-obsidianBlack text-textBase font-light xl:leading-[20px] xl:tracking-[0%]">
        {option.label}
      </span>
    </div>
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const baseInputClassName = className?.replace(/px-\[38px\]/g, '').trim() || '';

  return (
    <div className={`${fullWidth ? "w-full" : ""} text-start`}>
      {label && (
        <label htmlFor={name} className={`${labelClassName} block`}>
          {label}
          {required && <span className="text-black">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-[14px] flex items-center z-10 pointer-events-none">
            {icon}
          </span>
        )}
        <AutoComplete
          id={name}
          name={name}
          value={value || ""}
          suggestions={filteredSuggestions}
          completeMethod={handleSearch}
          onChange={handleAutoCompleteChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || loading}
          field="label"
          dropdown={false}
          forceSelection={false}
          className="w-full"
          inputClassName={`w-full ${baseInputClassName} ${
            error && touched ? "!border-red-500" : ""
          } ${
            icon ? "pl-[38px]" : "pl-[14px]"
          } ${endIcon || loading ? "pr-[38px]" : "pr-[14px]"} text-obsidianBlack text-textBase font-light xl:leading-[20px] xl:tracking-[0%]`}
          panelClassName="!border-lightGrayGamma !rounded-[8px] !shadow-lg"
          itemTemplate={itemTemplate || defaultItemTemplate}
          pt={{
            root: {
              className: `w-full`,
            },
            panel: {
              className: "!border-lightGrayGamma !rounded-[8px] !shadow-lg mt-1",
            },
            list: {
              className: "py-0",
            },
            item: ({ context }: { context: { selected: boolean } }) => ({
              className: `px-[14px] py-[12px] cursor-pointer ${
                context.selected ? "bg-offWhite" : ""
              } hover:bg-offWhite`,
            }),
            loadingIcon: {
              className: "!hidden",
            },
          }}
        />
        {loading && (
          <span className="absolute right-[14px] flex items-center pointer-events-none z-10">
            <FaSpinner className="animate-spin text-base text-deepTeal" />
          </span>
        )}
        {!loading && endIcon && (
          <span className="absolute right-[14px] flex items-center pointer-events-none z-10">
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

export default BaseSearchOptions;


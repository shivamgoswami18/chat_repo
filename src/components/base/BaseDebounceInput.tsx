"use client";

import React, { useEffect, useState } from "react";
import BaseInput, { BaseInputProps } from "./BaseInput";

interface BaseDebounceInputProps
  extends Omit<BaseInputProps, "onChange" | "value"> {
  debounceDelay?: number;
  onDebouncedChange?: (value: string) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value?: string;
}

const BaseDebounceInput: React.FC<BaseDebounceInputProps> = ({
  debounceDelay = 500,
  onDebouncedChange,
  onChange,
  value: controlledValue,
  defaultValue,
  ...restProps
}) => {
  const [internalValue, setInternalValue] = useState(
    controlledValue ?? defaultValue ?? ""
  );

  useEffect(() => {
    if (controlledValue === undefined) {
      return;
    }
    setInternalValue(controlledValue);
  }, [controlledValue]);

  const inputValue = controlledValue ?? internalValue;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDebouncedChange) {
        onDebouncedChange(inputValue);
      }
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, debounceDelay, onDebouncedChange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <BaseInput
      {...restProps}
      value={inputValue}
      onChange={handleChange}
      defaultValue={defaultValue}
    />
  );
};

export default BaseDebounceInput;

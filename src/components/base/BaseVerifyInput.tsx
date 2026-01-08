"use client";

import React from "react";
import { InputText } from "primereact/inputtext";
import { nonDigitsRegex, onlySingleDigitRegex } from "../constants/Validation";

interface BaseOTPInputProps {
  length: number;
  otp: string[];
  setOtp: (otp: string[]) => void;
  className?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

export default function BaseOTPInput({
  length,
  otp,
  setOtp,
  className,
  error,
  touched,
  disabled,
}: Readonly<BaseOTPInputProps>) {
  const focusInput = (id: string) => {
    (document.getElementById(id) as HTMLInputElement | null)?.focus?.();
  };

  const handleChange = (value: string, index: number) => {
    if (disabled) return;

    if (value === "") {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);
      return;
    }

    if (!onlySingleDigitRegex.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (index < length - 1) {
      focusInput(`otp-${index + 1}`);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (disabled) return;

    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      const updated = [...otp];
      if (updated[index]) {
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        updated[index - 1] = "";
        setOtp(updated);
        focusInput(`otp-${index - 1}`);
      }
      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      focusInput(`otp-${index - 1}`);
    }

    if (key === "ArrowRight" && index < length - 1) {
      focusInput(`otp-${index + 1}`);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();

    const pasteData = e.clipboardData
      ?.getData("text")
      ?.replace(nonDigitsRegex, "")
      ?.slice(0, length);

    if (!pasteData) return;

    const updated = [...otp];

    pasteData.split("").forEach((digit, i) => {
      updated[i] = digit;
    });

    setOtp(updated);

    focusInput(`otp-${pasteData.length - 1}`);
  };

  return (
    <div>
      <div className="flex gap-2">
        {otp.map((digit, index) => {
          const commonProps = {
            id: `otp-${index}`,
            maxLength: 1,
            value: digit,
            disabled,
            placeholder: "-",
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, index),
            onPaste: handlePaste,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, index),
            className: `text-center ${className} ${
              error && touched ? "!border-red-500" : ""
            }`,
            "aria-describedby": error && touched ? `error-${name}` : undefined,
          };

          return <InputText key={index} {...commonProps} />;
        })}
      </div>

      {error && touched && (
        <small id={`error-${name}`} className="p-error text-[12px] mt-1 block">
          {error}
        </small>
      )}
    </div>
  );
}

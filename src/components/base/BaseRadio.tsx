import React from "react";
import { RadioButton } from "primereact/radiobutton";

interface BaseRadioProps {
  name: string;
  label?: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  labelClassName?: string;
  radioClassName?: string;
  inline?: boolean;
}

const BaseRadio: React.FC<BaseRadioProps> = ({
  name,
  label,
  value,
  checked,
  onChange,
  onBlur,
  disabled = false,
  labelClassName = "",
  radioClassName = "",
  inline = false,
}) => {
  const id = `${name}-${value}`;

  return (
    <div
      className={inline ? "inline-flex items-center mr-4" : "flex items-center"}
    >
      <RadioButton
        inputId={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.value)}
        onBlur={onBlur}
        disabled={disabled}
        pt={{
          box: {
            className: radioClassName,
          },
        }}
      />
      {label && (
        <label
          htmlFor={id}
          className={`cursor-pointer select-none ml-2 ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default BaseRadio;

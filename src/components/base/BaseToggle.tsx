
"use client";

import React from "react";
import { InputSwitch } from "primereact/inputswitch";

interface BaseToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const BaseToggle: React.FC<BaseToggleProps> = ({
  checked,
  onChange,
  disabled,
}) => {
  return (
    <InputSwitch
      checked={checked || false}
      disabled={disabled}
      onChange={(e) => onChange(!!e.value)}
    />
  );
};

export default BaseToggle;

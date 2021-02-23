import React from "react";
import { tw } from "twind";

interface CheckboxProps {
  className?: string;
  value?: boolean | undefined;
  label?: string;
  onChange?: (e?: any) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  value,
  label,
  ...props
}) => {
  return (
    <div className={className}>
      <label>
        <input
          type="checkbox"
          checked={value}
          {...props}
          className={tw`mr-3`}
        />
        {label}
      </label>
    </div>
  );
};

import React from "react";

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
        <input type="checkbox" checked={value} {...props} className={`mr-3`} />
        {label}
      </label>
    </div>
  );
};

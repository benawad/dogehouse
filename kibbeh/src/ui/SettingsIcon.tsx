import React, { ReactElement } from "react";

export interface SettingsIconProps {
  icon: ReactElement;
  label: string;
  trailingIcon?: ReactElement;
  classes?: string;
}

export const SettingsIcon: React.FC<SettingsIconProps> = ({
  icon,
  label,
  trailingIcon,
  classes = "",
}) => {
  return (
    <div
      className={`
      w-full items-center px-4 py-3 md:py-2 cursor-pointer hover:bg-primary-700 
      border-b md:border-none border-primary-700 ${classes}`}
    >
      {icon}
      <span className="ml-2 font-medium text-primary-100 flex-1 capitalize flex-1">
        {label}
      </span>
      {trailingIcon && trailingIcon}
    </div>
  );
};

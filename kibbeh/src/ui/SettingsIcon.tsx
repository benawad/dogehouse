import React, { ReactElement } from "react";

export interface SettingsIconProps {
  icon: ReactElement;
  label: string;
  trailingIcon?: ReactElement;
  classes?: string;
  onClick?: () => void;
}

export const SettingsIcon: React.FC<SettingsIconProps> = ({
  icon,
  label,
  trailingIcon,
  classes = "",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
      w-full items-center px-4 py-3 md:py-2 cursor-pointer hover:bg-primary-700
      border-b md:border-none border-primary-700 ${classes}`}
    >
      {icon}
      <span className="ml-2 font-medium text-primary-100 flex-1 capitalize">
        {label}
      </span>
      {trailingIcon && trailingIcon}
    </button>
  );
};

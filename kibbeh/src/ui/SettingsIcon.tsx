import React, { ReactElement } from "react";

export interface SettingsIconProps {
  icon: ReactElement;
  text: string;
  trailingIcon?: ReactElement;
  classes?: string;
}

export const SettingsIcon: React.FC<SettingsIconProps> = ({
  icon,
  text,
  trailingIcon,
  classes,
}) => {
  return (
    <div
      className={`w-full font-bold items-center py-2 px-3 cursor-pointer hover:bg-primary-700 ${classes}`}
    >
      {icon}
      <span className="ml-2 text-button flex-1 capitalize flex-1">{text}</span>
      {trailingIcon && trailingIcon}
    </div>
  );
};

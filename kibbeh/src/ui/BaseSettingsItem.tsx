import React, { ReactNode } from "react";

export interface BaseSettingsItemProps {
  children: ReactNode;
}

export const BaseSettingsItem: React.FC<BaseSettingsItemProps> = ({
  children,
  ...props
}) => {
  return (
    <div className={`bg-primary-900 rounded-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

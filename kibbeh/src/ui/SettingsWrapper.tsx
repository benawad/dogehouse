import React, { ReactNode } from "react";

export interface SettingsWrapperProps {
  children: ReactNode;
}

export const SettingsWrapper: React.FC<SettingsWrapperProps> = ({
  children,
  ...props
}) => {
  return (
    <div className="bg-primary-800 rounded-8 p-4" {...props}>
      {children}
    </div>
  );
};

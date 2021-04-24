import React from "react";
import { BaseSettingsItem } from "./BaseSettingsItem";
import { Button } from "./Button";

export type SettingsItemButtonProps = {
  text: string,
  buttonText: string,
  disabled?: boolean,
  className: string,
  onClick: (e: React.MouseEvent | React.TouchEvent) => void,
};

export const SettingsItemButton: React.FC<SettingsItemButtonProps> = ({
  text,
  buttonText,
  disabled = false,
  className = "",
  onClick,
}) => {
  return (
    <BaseSettingsItem className={`p-4 ${className}`}>
      <p className="text-primary-100 mb-4">
        {text}
      </p>
      <Button
        color="secondary-accent"
        size="small"
        onClick={onClick}
        disabled={disabled}
        className="py-2"
      >
        <p className="font-bold">
          {buttonText}
        </p>
      </Button>
    </BaseSettingsItem>
  );
};

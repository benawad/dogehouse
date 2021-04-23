import React from "react";
import { Button } from "./Button";

export type SettingsItemButtonProps = {
  text: string,
  buttonText: string,
  disabled?: boolean,
  onClick: (e: React.MouseEvent | React.TouchEvent) => void,
};

export const SettingsItemButton: React.FC<SettingsItemButtonProps> = ({
  text,
  buttonText,
  disabled = false,
  onClick,
}) => {
  return (
    <div className="bg-primary-900 rounded-8 p-4" style={{ maxWidth: 600 }}>
      <p className="text-primary-200 mb-4">{text}</p>
      <Button color="accent-secondary" size="small" onClick={onClick} disabled={disabled} className="py-2" >
        <p className="font-bold">
          {buttonText}
        </p>
      </Button>
    </div>
  );
};

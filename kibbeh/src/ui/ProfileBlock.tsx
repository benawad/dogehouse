import React from "react";

export interface ProfileBlockProps {
  top: React.ReactNode;
  bottom: React.ReactNode;
}

export const ProfileBlock: React.FC<ProfileBlockProps> = ({ top, bottom }) => {
  return (
    <div className="flex-1 flex-col">
      <div className="justify-between items-end mb-5 max-w-md">{top}</div>
      <div className="justify-between items-end mb-5 max-w-md">{bottom}</div>
    </div>
  );
};

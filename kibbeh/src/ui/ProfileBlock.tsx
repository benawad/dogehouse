import React from "react";

export interface ProfileBlockProps {
  top: React.ReactNode;
  bottom: React.ReactNode;
}

export const ProfileBlock: React.FC<ProfileBlockProps> = ({ top, bottom }) => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex justify-between items-end mb-5 max-w-md">{top}</div>
      <div className="flex justify-between items-end mb-5 max-w-md">
        {bottom}
      </div>
    </div>
  );
};

import React from "react";

interface RoomSectionHeaderProps {
  title: string;
  tagText: string;
}

export const RoomSectionHeader: React.FC<RoomSectionHeaderProps> = ({
  title,
  tagText,
}) => {
  return (
    <div className={`items-center`}>
      <div className={`mr-2 font-bold text-xl text-primary-100`}>{title}</div>
      <div
        style={{ height: 14, paddingTop: 1 }}
        className={`bg-primary-600 rounded-5 px-2 text-tiny text-primary-100 items-center justify-center`}
      >
        {tagText}
      </div>
    </div>
  );
};

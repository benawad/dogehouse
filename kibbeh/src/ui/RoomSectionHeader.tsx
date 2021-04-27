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
    <div className={`flex items-center col-span-full`}>
      <div className={`flex mr-2 font-bold text-xl text-primary-100`}>
        {title}
      </div>
      <div
        style={{ height: 18 }}
        className={`bg-primary-600 rounded-5 px-2 text-sm font-bold text-primary-100 items-center justify-center`}
      >
        {tagText}
      </div>
    </div>
  );
};

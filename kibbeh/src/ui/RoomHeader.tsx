import React from "react";
import { SolidCaretRight, SolidNotification } from "../icons";

interface RoomHeaderProps {
  onTitleClick: () => void;
  title: string;
  names: string[];
  description: string;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  onTitleClick,
  title,
  names,
  description,
}) => {
  return (
    <div
      className={`flex-col p-4 bg-primary-800 rounded-t-8 border-b border-primary-600 w-full`}
    >
      <div className={`text-primary-100`}>
        <button
          onClick={onTitleClick}
          className={`text-xl font-bold mb-2 flex-1 truncate`}
        >
          {title}
        </button>
        {/* @todo show description */}
        <SolidCaretRight
          className={`ml-2 transform rotate-90 cursor-pointer`}
          width={20}
          height={20}
        />
      </div>
      <div className={`text-primary-200 text-sm`}>
        with{" "}
        <span
          style={{ marginLeft: 3 }}
          className={`font-bold text-primary-100`}
        >
          {names.join(", ")}
        </span>
      </div>
    </div>
  );
};

import React from "react";
import { SolidNotification } from "../icons";

interface RoomHeaderProps {
  title: string;
  names: string[];
  description: string;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  title,
  names,
  description,
}) => {
  return (
    <div
      className={`flex-col p-4 bg-primary-800 rounded-t-8 border-b border-primary-600 w-full`}
    >
      <div className={`text-primary-100`}>
        <div className={`text-xl font-bold mb-2 flex-1 truncate`}>{title}</div>
        {/* @todo show description */}
        {/* swap in real icon */}
        <SolidNotification className={`ml-2`} width={16} height={16} />
      </div>
      <div className={`text-primary-200 text-xs`}>
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

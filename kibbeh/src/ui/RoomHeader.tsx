import React, { useState } from "react";
import { SolidCaretRight } from "../icons";

interface RoomHeaderProps {
  onTitleClick?: () => void;
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
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`flex flex-col p-4 bg-primary-800 rounded-t-8 border-b border-primary-600 w-full`}
    >
      <div className={`flex text-primary-100`}>
        <button
          onClick={onTitleClick}
          className={`flex text-xl font-bold mb-2 flex-1 truncate`}
        >
          {title}
        </button>
        <button className="pb-2" onClick={() => setOpen(!open)}>
          <SolidCaretRight
            className={`ml-2 transform ${
              open ? "-rotate-90" : "rotate-90"
            } cursor-pointer`}
            width={20}
            height={20}
          />
        </button>
      </div>
      <div className={`flex text-primary-200 text-sm`}>
        with{" "}
        <span
          style={{ marginLeft: 3 }}
          className={`font-bold text-primary-100`}
        >
          {names.join(", ")}
        </span>
      </div>
      {open ? <div className="text-primary-100 mt-4">{description}</div> : null}
    </div>
  );
};

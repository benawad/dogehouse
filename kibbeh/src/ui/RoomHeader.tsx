import React, { useEffect, useState } from "react";
import { SolidCaretRight } from "../icons";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";

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
  const [hasDescription, setHasDescription] = useState<boolean>(false);

  useEffect(() => {
    setHasDescription(description.trim().length > 0);
  }, [description]);

  return (
    <div
      className={`flex flex-col p-4 bg-primary-800 rounded-t-8 border-b border-primary-600 w-full ${
        hasDescription ? "cursor-pointer" : ""
      }`}
      onClick={hasDescription ? () => setOpen(!open) : undefined}
    >
      <div className={`flex text-primary-100 mb-2`}>
        <button
          onClick={onTitleClick}
          className={`flex text-xl font-bold flex-1 truncate`}
          data-testid="room-title"
        >
          {title}
        </button>
        {hasDescription && (
          <button className="flex" onClick={() => setOpen(!open)}>
            <SolidCaretRight
              className={`transform ${
                open ? "-rotate-90 mt-auto" : "mr-auto rotate-90"
              } cursor-pointer`}
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      <div className={`flex text-primary-200 text-sm`}>
        <span style={{ marginRight: 4 }}>with</span>{" "}
        {names.map((username, i) => (
          <ApiPreloadLink
            route="profile"
            data={{ username }}
            key={username + i}
          >
            <span
              className={`font-bold text-primary-100 hover:underline`}
              style={{ marginRight: 4 }}
            >
              {`${username}`}
              {i === names.length - 1 ? "" : `,`}
            </span>
          </ApiPreloadLink>
        ))}
      </div>
      {open ? <div className="text-primary-100 mt-4">{description}</div> : null}
    </div>
  );
};

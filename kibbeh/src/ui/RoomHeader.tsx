import React, { useState } from "react";
import { SolidCaretRight } from "../icons";
import { linkRegex } from "../lib/constants";
import normalizeUrl from "normalize-url";

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
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`flex flex-col p-4 bg-primary-800 rounded-t-8 border-b border-primary-600 w-full`}
    >
      <div className={`flex text-primary-100 mb-2`}>
        <button
          onClick={onTitleClick}
          className={`flex text-xl font-bold flex-1 truncate`}
          data-testid="room-title"
        >
          {title}
        </button>
        {description.trim().length > 0 && (
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
        with{" "}
        <span
          style={{ marginLeft: 3 }}
          className={`font-bold text-primary-100`}
        >
          {names.join(", ")}
        </span>
      </div>
      {/* {open ? <div className="text-primary-100 mt-4">{description}</div> : null} */}

      {open && description?.trim() && (
        <div className="mt-4 overflow-y-auto" style={{ maxHeight: "100px" }}>
          {description.split(/\n/).map(
            (line, i) =>
              line.trim() && (
                <div key={i}>
                  {line.split(" ").map((chunk, j) => {
                    try {
                      return linkRegex.test(chunk) ? (
                        <a
                          href={normalizeUrl(chunk)}
                          rel="noreferrer"
                          className="text-accent text-center hover:underline inline"
                          key={`${i}${j}`}
                          target="_blank"
                        >
                          {chunk}&nbsp;
                        </a>
                      ) : (
                        <span
                          className="text-primary-100"
                          key={`${i}${j}`}
                        >{`${chunk} `}</span>
                      );
                    } catch (err) {}

                    return null;
                  })}

                  <br />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

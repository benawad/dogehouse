import React from "react";

export interface RoomSearchResultProps {
  room: {
    id: string;
    displayName: string;
    hosts: string[];
    userCount: number;
  };
}

export const RoomSearchResult: React.FC<RoomSearchResultProps> = ({ room }) => {
  return (
    <div className="cursor-pointer hover:bg-primary-700 px-4 py-3 w-full">
      <div className="flex-col w-full">
        <div className="w-full">
          <span
            className="text-primary-100 font-bold flex-1 items-center"
            style={{ lineHeight: "22px" }}
          >
            {room.displayName}
          </span>
          <span className="items-center">
            <span
              className="rounded-full inline-block bg-accent mr-1"
              style={{ width: "8px", height: "8px" }}
            />
            <span className="text-primary-200 font-bold">{room.userCount}</span>
          </span>
        </div>
        <span className="text-primary-300 text-sm">
          {room.hosts.slice(0, 2).join(", ")}
        </span>
      </div>
    </div>
  );
};

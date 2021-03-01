import { useAtom } from "jotai";
import React from "react";
import { meAtom } from "../atoms";
import { Codicon } from "../svgs/Codicon";
import { CurrentRoom, Room } from "../types";

interface RoomProps {
  active?: boolean;
  onClick: () => void;
  room: Room | CurrentRoom;
  currentRoomId: string | undefined;
}

export const RoomCard: React.FC<RoomProps> = ({
  room,
  onClick,
  active,
  currentRoomId,
}) => {
  const [me] = useAtom(meAtom);

  let n = room.numPeopleInside;
  const previewNodes = [];
  let userList = room.peoplePreviewList;
  if (currentRoomId === room.id && "users" in room) {
    n = room.users.length;
    userList = room.users;
  }
  for (let i = 0; i < Math.min(6, userList.length); i++) {
    const p = userList[i];
    if (p.id === me?.id && currentRoomId !== room.id) {
      n--;
      continue;
    }
    previewNodes.push(
      <div
        key={p.id}
        className={`text-left text-simple-gray-d9 ${!i ? "mt-1.5" : "mt-0.5"}`}
      >
        {p.displayName?.slice(0, 50)}
      </div>
    );
    if (i >= 4 && previewNodes.length >= 5) {
      break;
    }
  }

  return (
    <div>
      <button
        onClick={onClick}
        className={`w-full ${
          active ? "bg-simple-gray-4d" : "bg-simple-gray-33"
        } hover:bg-simple-gray-69 active:bg-simple-gray-23 py-2.5 px-5 rounded-lg`}
      >
        <div className={`flex text-white`}>
          <div
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
            className={`text-left flex-1 text-xl text-simple-gray-d9 text-ellipsis overflow-hidden break-all`}
          >
            {room.name?.slice(0, 100)}
          </div>
          <div className={`flex items-center`}>
            <Codicon name="person" /> {n}
          </div>
        </div>
        {previewNodes}
      </button>
    </div>
  );
};

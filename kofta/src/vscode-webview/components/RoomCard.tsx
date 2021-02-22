import { useAtom } from "jotai";
import React from "react";
import { meAtom } from "../atoms";
import { Codicon } from "../svgs/Codicon";
import { CurrentRoom, Room } from "../types";

import {tw} from "twind";

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
        style={{
          marginTop: !i ? 6 : 2,
          color: "#D9D9D9",
        }}
        className={tw`text-left`}
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
        className={`RoomCard ${active ? "active" : ""}`}
      >
        <div className={tw`flex text-gray-50`}>
          <div
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
            className={tw`text-left flex-1 text-xl text-gray-300 text-ellipsis overflow-hidden break-words`}
          >
            {room.name?.slice(0, 100)}
          </div>
          <div className={tw`flex items-center`}>
            <Codicon name="person" /> {n}
          </div>
        </div>
        {previewNodes}
      </button>
    </div>
  );
};

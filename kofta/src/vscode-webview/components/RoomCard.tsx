import { useAtom } from "jotai";
import React from "react";
import { meAtom } from "../atoms";
import { Codicon } from "../svgs/Codicon";
import { CurrentRoom, Room } from "@dogehouse/feta/types";

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
        className={`text-left text-simple-gray-d9 ${!i ? "m-1.5" : "m-0.5"}`}
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
        <div className={`flex text-white`}>
          <div
            style={{
<<<<<<< HEAD
=======
              textAlign: "left",
              fontSize: "calc(var(--vscode-font-size)*1.2)",
              flex: 1,
              color: "#D9D9D9",
>>>>>>> 76e5e6ddabfa381984235042bbfd5056e7372c0d
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
<<<<<<< HEAD
=======
              overflow: "hidden",
              textOverflow: "ellipsis",
>>>>>>> 76e5e6ddabfa381984235042bbfd5056e7372c0d
            }}
            className={`text-left flex-1 text-xl text-simple-gray-d9 text-ellipsis overflow-hidden break-words`}
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

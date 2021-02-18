import { useAtom } from "jotai";
import React from "react";
import { meAtom } from "../atoms";
import { Codicon } from "../svgs/Codicon";
import { CurrentRoom, Room } from "../types";
import { tw } from "twind";

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
  let n = room.numPeopleInside,
    sn = room.peoplePreviewList.filter(x => x.canSpeakForRoomId).length;
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
          textAlign: "left",
        }}
      >
        {p.displayName?.slice(0, 50)}
      </div>,
    );
    if (i >= 4 && previewNodes.length >= 5) {
      break;
    }
  }

  return (
    <div>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: "10px 20px",
          backgroundColor: active ? "#4D4D4D" : "#333333",
          borderRadius: 9,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "var(--vscode-inputOption-activeForeground)",
          }}
        >
          <div
            style={{
              textAlign: "left",
              fontSize: "calc(var(--vscode-font-size)*1.2)",
              flex: 1,
              color: "#D9D9D9",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflowWrap: "break-word",
              WebkitLineClamp: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {room.name?.slice(0, 100)}
          </div>
          <div className={tw`flex items-center mr-4`}>
            <Codicon name="person" /> {n - sn < 0 ? 0 : n - sn}
          </div>
          <div className={tw`flex items-center`}>
            <Codicon name="megaphone" className={tw`mr-1`} /> {sn}
          </div>
        </div>
        {previewNodes}
      </button>
    </div>
  );
};

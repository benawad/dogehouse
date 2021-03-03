import React, { useState } from "react";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { truncate } from "../../utils/truncate";

interface RoomDescriptionProps {}

export const RoomDescription: React.FC<RoomDescriptionProps> = () => {
  const { currentRoom } = useCurrentRoomStore();
  const [expanded, setExpanded] = useState(false);

  return currentRoom?.description ? (
    <div className="p-3 rounded-lg m-3 bg-simple-gray-3a">
      <p>
        {expanded ? currentRoom.description : truncate(currentRoom.description)}
        <a
          className="ml-1 text-blue-400 cursor-pointer hover:text-blue-300"
          onClick={() => setExpanded(!expanded)}
        >
          {currentRoom.description?.length > 100
            ? "show " + (expanded ? "less" : "more")
            : null}
        </a>
      </p>
    </div>
  ) : null;
};

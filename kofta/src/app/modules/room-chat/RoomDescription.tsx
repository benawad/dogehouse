import React, { useState } from "react";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { truncate } from "../../utils/truncate";

const MAX_COLLAPSED_CHARACTERS = 100;

interface RoomDescriptionProps {}

export const RoomDescription: React.FC<RoomDescriptionProps> = () => {
	const [expanded, setExpanded] = useState(false);
	const { currentRoom } = useCurrentRoomStore();
	return currentRoom?.description ? (
		<div className="p-3 rounded-lg m-3 bg-simple-gray-3a">
			<p className="text-gray-400 mb-1">room description</p>
			<p className="break-all">
				{expanded
					? currentRoom.description
					: truncate(currentRoom.description, MAX_COLLAPSED_CHARACTERS)}
				<button
					className="ml-1 text-blue-400 cursor-pointer hover:text-blue-300"
					onClick={() => setExpanded(!expanded)}
				>
					{currentRoom.description?.length > MAX_COLLAPSED_CHARACTERS
						? "show " + (expanded ? "less" : "more")
						: null}
				</button>
			</p>
		</div>
	) : null;
};

import React, { useState } from "react";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { truncate } from "../../utils/truncate";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";

const MAX_COLLAPSED_CHARACTERS = 100;

interface RoomDescriptionProps {}

export const RoomDescription: React.FC<RoomDescriptionProps> = () => {
	const [expanded, setExpanded] = useState(false);
	const { currentRoom } = useCurrentRoomStore();
	const { t } = useTypeSafeTranslation();
	return currentRoom?.description ? (
		<div className="p-3 rounded-lg m-3 bg-simple-gray-3a">
			<p className="text-gray-400 mb-1">
				{t("modules.roomChat.roomDescription")}
			</p>
			<p className="whitespace-pre-wrap break-all">
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

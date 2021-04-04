import React, { useMemo, useState } from "react";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { truncate } from "../../utils/truncate";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";

const MAX_COLLAPSED_CHARACTERS = 60;
const MAX_COLLAPSED_LINES = 2;

interface RoomDescriptionProps {}

export const RoomDescription: React.FC<RoomDescriptionProps> = () => {
	const [expanded, setExpanded] = useState(false);
	const { currentRoom } = useCurrentRoomStore();
	const { t } = useTypeSafeTranslation();

	const [truncatedString, isTruncated] = useMemo(() => 
		truncate(currentRoom?.description, MAX_COLLAPSED_CHARACTERS, MAX_COLLAPSED_LINES),
		[currentRoom?.description]
	);

	return currentRoom?.description ? (
		<div className="p-3 rounded-lg m-3 bg-simple-gray-3a">
			<p className="text-gray-400 mb-1">
				{t("modules.roomChat.roomDescription")}
			</p>
			<p className="whitespace-pre-wrap break-all overflow-y-auto max-h-24">
				{expanded
					? currentRoom.description
					: truncatedString}
				<button
					className="ml-1 text-blue-400 cursor-pointer hover:text-blue-300"
					onClick={() => setExpanded(!expanded)}
				>
					{isTruncated
						? "show " + (expanded ? "less" : "more")
						: null}
				</button>
			</p>
		</div>
	) : null;
};

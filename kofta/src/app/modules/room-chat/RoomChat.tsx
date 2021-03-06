import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatList } from "./RoomChatList";
import { RoomChatMentions } from "./RoomChatMentions";
import { RoomDescription } from "./RoomDescription";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatProps {
	sidebar: boolean;
}
export const roomChatMediaQuery = "(min-width: 980px)";

export const RoomChat: React.FC<ChatProps> = ({ sidebar }) => {
	const chatShouldBeSidebar = useMediaQuery({ query: roomChatMediaQuery });
	const { currentRoom: room } = useCurrentRoomStore();

	const [open, reset, toggleOpen] = useRoomChatStore((s) => [
		s.open,
		s.reset,
		s.toggleOpen,
	]);

	const { t } = useTypeSafeTranslation();

	useEffect(() => {
		if (!room) {
			reset();
		}
	}, [reset, room]);
	if (
		!open ||
		(!chatShouldBeSidebar && sidebar) ||
		(chatShouldBeSidebar && !sidebar)
	) {
		return null;
	}
	return (
		<div
			style={{
				width: sidebar ? 340 : "100%",
			}}
			className={`flex flex-1 w-full overflow-y-auto`}
		>
			<div
				style={{
					width: sidebar ? 340 : "100%",
					height: sidebar ? "100%" : undefined,
				}}
				className={`bg-simple-gray-26 flex flex-1 w-full flex-col ${
					sidebar ? `fixed bottom-0` : ``
				}`}
			>
				<button
					onClick={() => toggleOpen()}
					className={`bg-simple-gray-26 border-b border-simple-gray-80 text-white py-4 px-8 text-2xl flex items-center h-20`}
				>
					{t("modules.roomChat.title")}{" "}
					<span className={`ml-2 text-simple-gray-a6`}>
						{t("modules.roomChat.emotesSoon")}
					</span>
				</button>
				<RoomDescription />
				<RoomChatList />
				<RoomChatMentions />
				<RoomChatInput />
			</div>
		</div>
	);
};

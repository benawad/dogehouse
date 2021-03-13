import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React, { useRef, useState } from "react";
import { Smile } from "react-feather";
import { toast } from "react-toastify";
import { wsend } from "../../../createWebsocket";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { modalAlert } from "../../components/AlertModal";
import { Button } from "../../components/Button";
import { Codicon } from "../../svgs/Codicon";
import { createChatMessage } from "../../utils/createChatMessage";
import { useMeQuery } from "../../utils/useMeQuery";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";

interface ChatInputProps {}

export const RoomChatInput: React.FC<ChatInputProps> = () => {
	const { message, setMessage } = useRoomChatStore();
	const {
		setQueriedUsernames,
		queriedUsernames,
		mentions,
		setMentions,
		activeUsername,
		setActiveUsername,
	} = useRoomChatMentionStore();
	const { currentRoom } = useCurrentRoomStore();
	const { me } = useMeQuery();
	const [isEmoji, setIsEmoji] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);
	const { t } = useTypeSafeTranslation();

	let position: number = 0;

	const navigateThroughQueriedUsers = (e: any) => {
		// Use dom method, GlobalHotkeys apparently don't catch arrow-key events on inputs
		if (
			!["ArrowUp", "ArrowDown", "Enter"].includes(e.code) ||
			!queriedUsernames.length
		)
			return;

		e.preventDefault();

		let changeToIndex = null;
		const activeIndex = queriedUsernames.findIndex(
			(username) => username.id === activeUsername
		);

		if (e.code === "ArrowUp") {
			changeToIndex =
				activeIndex === 0 ? queriedUsernames.length - 1 : activeIndex - 1;
		} else if (e.code === "ArrowDown") {
			changeToIndex =
				activeIndex === queriedUsernames.length - 1 ? 0 : activeIndex + 1;
		} else if (e.code === "Enter") {
			const selected = queriedUsernames[activeIndex];
			setMentions([...mentions, selected]);
			setMessage(
				`${message.substring(0, message.lastIndexOf("@") + 1)}${
					selected.username
				} `
			);
			setQueriedUsernames([]);
		}

		// navigate to next/prev mention suggestion item
		if (changeToIndex !== null) {
			setActiveUsername(queriedUsernames[changeToIndex]?.id);
		}
	};

	const addEmoji = (emoji: any) => {
		position =
			(position === 0 ? inputRef!.current!.selectionStart : position + 2) || 0;

		const newMsg = [
			message.slice(0, position),
			emoji.native,
			message.slice(position),
		].join("");
		setMessage(newMsg);
	};

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
	) => {
		e.preventDefault();

		if (
			!message ||
			!message.trim() ||
			!message.replace(/[\u200B-\u200D\uFEFF]/g, "")
		)
			return;

		if (!me) return;

		if (me.id in useRoomChatStore.getState().bannedUserIdMap) {
			modalAlert(t("modules.roomChat.bannedAlert"));
			return;
		}

		if (Date.now() - lastMessageTimestamp <= 1000) {
			if (!toast.isActive("message-timeout")) {
				toast(t("modules.roomChat.waitAlert"), {
					toastId: "message-timeout",
					type: "warning",
					autoClose: 3000,
				});
			}

			return;
		}

		const tmp = message;
		setMessage("");

		wsend({
			op: "send_room_chat_msg",
			d: createChatMessage(tmp, mentions, currentRoom?.users),
		});
		setQueriedUsernames([]);

		setLastMessageTimestamp(Date.now());
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`bg-simple-gray-26 pb-5 px-8 pt-1 flex flex-col`}
		>
			{isEmoji ? (
				<Picker
					set="apple"
					onSelect={(emoji) => {
						addEmoji(emoji);
					}}
					style={{
						position: "relative",
						width: "100%",
						minWidth: "278px",
						right: 0,
						overflowY: "hidden",
						outline: "none",
						alignSelf: "flex-end",
						margin: "0 0 8px 0",
					}}
					sheetSize={32}
					theme="dark"
					emojiTooltip={true}
					showPreview={false}
					showSkinTones={false}
					i18n={{
						search: t("modules.roomChat.search"),
						categories: {
							search: t("modules.roomChat.searchResults"),
							recent: t("modules.roomChat.recent"),
						},
					}}
				/>
			) : null}
			<div className="flex items-stretch">
				<div className="flex-1 mr-2 lg:mr-0 items-end">
					<input
						maxLength={512}
						placeholder={t("modules.roomChat.sendMessage")}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						ref={inputRef}
						className={`w-full white bg-simple-gray-59 px-4 py-2 rounded text-lg focus:outline-none pr-12`}
						autoComplete="off"
						onKeyDown={navigateThroughQueriedUsers}
						onFocus={() => {
							setIsEmoji(false);
							position = 0;
						}}
						id="room-chat-input"
					/>
					<div
						style={{
							color: "rgb(167, 167, 167)",
							display: "flex",
							marginRight: 13,
							marginTop: -35,
							flexDirection: "row-reverse",
						}}
						className={`mt-3 right-12 cursor-pointer`}
						onClick={() => {
							setIsEmoji(!isEmoji);
							position = 0;
						}}
					>
						<Smile style={{ inlineSize: "23px" }}></Smile>
					</div>
				</div>

				{/* Send button (mobile only) */}
				<Button
					onClick={handleSubmit}
					variant="small"
					className="lg:hidden"
					style={{ padding: "10px 12px" }}
				>
					<Codicon name="arrowRight" />
				</Button>
			</div>
		</form>
	);
};

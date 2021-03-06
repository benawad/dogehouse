import { isToday, format, isPast, differenceInMilliseconds } from "date-fns";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import {
	wsend,
	wsMutation,
	wsMutationThrowError,
} from "../../../createWebsocket";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { meAtom } from "../../atoms";
import { AddToCalendarButton } from "../../components/add-to-calendar/AddToCalendarButton";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { modalConfirm } from "../../components/ConfirmModal";
import { ScheduledRoom } from "../../types";
import { roomToCurrentRoom } from "../../utils/roomToCurrentRoom";
import { useRoomChatStore } from "../room-chat/useRoomChatStore";

interface ScheduledRoomCardProps {
	onEdit: () => void;
	onDeleteComplete: () => void;
	info: ScheduledRoom;
}

export const ScheduledRoomCard: React.FC<ScheduledRoomCardProps> = ({
	onEdit,
	onDeleteComplete,
	info: { id, name, scheduledFor, creator, description },
}) => {
	const history = useHistory();
	const {
		mutateAsync: mutateAsyncStartRoom,
		isLoading: isLoadingStartRoom,
	} = useMutation(wsMutationThrowError, {
		onSuccess: ({ room }) => {
			console.log("new room voice server id: " + room.voiceServerId);
			useRoomChatStore.getState().clearChat();
			wsend({ op: "get_current_room_users", d: {} });
			history.push("/room/" + room.id);
			useCurrentRoomStore
				.getState()
				.setCurrentRoom(() => roomToCurrentRoom(room));
		},
	});
	const { mutateAsync, isLoading } = useMutation(wsMutation, {
		onSuccess: () => {
			onDeleteComplete();
		},
	});
	const [, rerender] = useState(0);
	const dt = useMemo(() => new Date(scheduledFor), [scheduledFor]);
	useEffect(() => {
		let done = false;
		const id = setTimeout(() => {
			done = true;
			rerender((x) => x + 1);
		}, differenceInMilliseconds(dt, new Date()) + 1000); // + 1 second to be safe
		return () => {
			if (!done) {
				clearTimeout(id);
			}
		};
	}, [dt]);
	const [me] = useAtom(meAtom);
	return (
		<div>
			<div className={`w-full ${"bg-simple-gray-33"} py-2.5 px-5 rounded-lg`}>
				<div className={`text-white`}>
					<div className={`flex justify-between`}>
						<div>
							{isToday(dt)
								? format(dt, `K:mm a`)
								: format(dt, `MM/dd/yyyy K:mm a`)}
						</div>
						<AddToCalendarButton event={{
							name: name,
							details: description,
							location: id,
							startsAt: dt.toISOString(),
							endsAt: dt.toISOString()
						}}></AddToCalendarButton>
						{me?.id === creator.id ? (
							<div className={`flex`}>
								<Button variant="small" onClick={() => onEdit()}>
									edit
								</Button>
								<div className={`ml-4`}>
									<Button
										loading={isLoading}
										variant="small"
										onClick={() =>
											modalConfirm(
												"Are you sure you want to delete this scheduled room?",
												() => {
													mutateAsync({
														op: "delete_scheduled_room",
														d: { id },
													});
												}
											)
										}
									>
										delete
									</Button>
								</div>
							</div>
						) : null}
					</div>
					<div className={`flex items-center my-4`}>
						<Avatar size={25} src={creator.avatarUrl} />
						<div
							style={{
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: 3,
							}}
							className={`ml-2 text-left flex-1 text-xl text-simple-gray-d9 text-ellipsis overflow-hidden break-all`}
						>
							{name.slice(0, 100)}
						</div>
					</div>
					<div>
						{creator.displayName}
						{description ? ` | ` + description : ``}
					</div>
					{isPast(dt) ? (
						<div className={`mt-4`}>
							<Button
								loading={isLoadingStartRoom}
								onClick={() => {
									mutateAsyncStartRoom({
										op: "create_room_from_scheduled_room",
										d: {
											id,
											name,
											description,
										},
									});
								}}
							>
								start room
							</Button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

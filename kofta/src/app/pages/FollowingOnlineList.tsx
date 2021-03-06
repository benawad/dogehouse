import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { followingOnlineAtom } from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface FriendListProps {}

export const FollowingOnlineList: React.FC<FriendListProps> = () => {
	const history = useHistory();
	const [{ users, nextCursor }] = useAtom(followingOnlineAtom);
	const { currentRoom } = useCurrentRoomStore();
	const { t } = useTypeSafeTranslation();

	return (
		<Wrapper>
			<Backbar />
			<BodyWrapper>
				<div className={`mb-4 text-2xl`}>
					{t("pages.followingOnlineList.listHeader")}
				</div>
				{users.length === 0 ? <div>{t("common.noUsersFound")}</div> : null}
				{users.map((u) => (
					<div
						className={`border-b border-solid border-simple-gray-3c flex py-4 px-2 items-center`}
						key={u.id}
					>
						<button onClick={() => history.push(`/user`, u)}>
							<Avatar src={u.avatarUrl} isOnline={u.online} />
						</button>
						<button
							onClick={() => {
								if (u.currentRoom) {
									if (u.currentRoom.id !== currentRoom?.id) {
										wsend({ op: "join_room", d: { roomId: u.currentRoom.id } });
									}
									history.push("/room/" + u.currentRoom.id);
								}
							}}
							className={`ml-4 flex-1 text-left`}
						>
							<div className={`text-lg`}>
								{u.displayName || "@" + u.username}
							</div>
							<div style={{ color: "" }}>
								{u.currentRoom ? (
									<span>
										{t("pages.followingOnlineList.currentRoom")}{" "}
										<b>{u.currentRoom.name}</b>
									</span>
								) : null}
							</div>
						</button>
						{u.followsYou ? (
							<div className={`ml-auto`}>
								<Button
									onClick={() => {
										wsend({
											op: "create-room",
											d: {
												roomName: "My Private Room",
												value: "private",
												userIdToInvite: u.id,
											},
										});
									}}
									variant="small"
								>
									{t("pages.followingOnlineList.startPrivateRoom")}
								</Button>
							</div>
						) : null}
					</div>
				))}
				{nextCursor ? (
					<div className={`flex justify-center my-10`}>
						<Button
							variant="small"
							onClick={() =>
								wsend({
									op: "fetch_following_online",
									d: { cursor: nextCursor },
								})
							}
						>
							{t("common.loadMore")}
						</Button>
					</div>
				) : null}
			</BodyWrapper>
		</Wrapper>
	);
};

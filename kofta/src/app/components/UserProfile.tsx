import normalizeUrl from "normalize-url";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { wsend } from "../../createWebsocket";
import { useConsumerStore } from "../../webrtc/stores/useConsumerStore";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { linkRegex } from "../constants";
import { BaseUser, RoomUser } from "../types";
import { onFollowUpdater } from "../utils/onFollowUpdater";
import { useMeQuery } from "../utils/useMeQuery";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { EditProfileModal } from "./EditProfileModal";

interface UserProfileProps {
	profile: RoomUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({
	profile: userProfile,
}) => {
	const history = useHistory();
	const { me } = useMeQuery();
	const { setCurrentRoom } = useCurrentRoomStore();
	// if you edit your profile, me will be updated so we want to use that
	const profile: BaseUser | RoomUser =
		me?.id === userProfile.id ? me : userProfile;
	const [youAreFollowing, setYouAreFollowing] = useState(
		"youAreFollowing" in profile ? profile.youAreFollowing : false
	);
	const _youAreFollowing =
		"youAreFollowing" in profile && profile.youAreFollowing;
	useEffect(() => {
		if (_youAreFollowing) {
			setYouAreFollowing(_youAreFollowing);
		}
	}, [_youAreFollowing]);
	const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
	const { t } = useTypeSafeTranslation();
	const [count, setCount] = useState(0);
	return (
		<>
			<EditProfileModal
				user={profile}
				isOpen={editProfileModalOpen}
				onRequestClose={() => setEditProfileModalOpen(false)}
			/>
			<div className={`mb-4 flex justify-between align-center`}>
				<div
					onClick={() => {
						if (count >= 4) {
							toast("debug mode activated for this user", { type: "info" });
							useConsumerStore.getState().startDebugging(userProfile.id);
						} else {
							setCount((c) => c + 1);
						}
					}}
				>
					<Avatar src={profile.avatarUrl} />
				</div>
				{me?.id === profile.id ? (
					<div>
						<Button
							onClick={() => {
								setEditProfileModalOpen(true);
							}}
							variant="small"
						>
							{t("pages.viewUser.editProfile")}
						</Button>
					</div>
				) : null}
				{me?.id === profile.id ||
				userProfile.youAreFollowing === null ||
				userProfile.youAreFollowing === undefined ? null : (
					<div>
						<Button
							onClick={() => {
								wsend({
									op: "follow",
									d: {
										userId: profile.id,
										value: !youAreFollowing,
									},
								});
								setYouAreFollowing(!youAreFollowing);
								onFollowUpdater(setCurrentRoom, me, profile);
							}}
							variant="small"
						>
							{youAreFollowing ? "following" : "follow"}
						</Button>
					</div>
				)}
			</div>
			<div className={`font-semibold`}>{profile.displayName}</div>
			<div className={`my-1 flex`}>
				<div>@{profile.username}</div>
				{me?.id !== profile.id && userProfile.followsYou ? (
					<div className={`ml-2 text-simple-gray-3d`}>
						{t("pages.viewUser.followsYou")}
					</div>
				) : null}
			</div>
			<div className={`flex my-4`}>
				<button
					onClick={() => {
						wsend({
							op: `fetch_follow_list`,
							d: { isFollowing: false, userId: profile.id, cursor: 0 },
						});
						history.push(`/followers/${profile.id}`);
					}}
					className={`mr-3`}
				>
					<span className={`font-bold`}>{profile.numFollowers}</span>{" "}
					{t("pages.viewUser.followers")}
				</button>
				<button
					onClick={() => {
						wsend({
							op: `fetch_follow_list`,
							d: { isFollowing: true, userId: profile.id, cursor: 0 },
						});
						history.push(`/following/${profile.id}`);
					}}
				>
					<span className={`font-bold`}>{profile.numFollowing}</span>{" "}
					{t("pages.viewUser.following")}
				</button>
			</div>
			<div className="mb-4 whitespace-pre-wrap break-all">
			{profile.bio?.split(/\n/gm).map((line, i) => {
          return (
            <div key={i}>
              <span>
                {line.split(" ").map((chunk, j) => {
                  if (linkRegex.test(chunk)) {
                    try {
                      return (
                        <a
                          key={`${i}${j}`}
                          href={normalizeUrl(chunk)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 p-0 hover:underline"
                        >
                          {chunk}{" "}
                        </a>
                      );
                    } catch {}
                  }
                  return <span key={`${i}${j}`}>{chunk} </span>;
                })}
              </span>
              <br />
            </div>
          );
        })}
			</div>
		</>
	);
};

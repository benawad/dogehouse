import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useHistory } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import { meAtom } from "../atoms";
import { BaseUser, RoomUser } from "../types";
import { onFollowUpdater } from "../utils/onFollowUpdater";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { EditProfileModal } from "./EditProfileModal";
import { linkRegex } from "../constants";
import normalizeUrl from "normalize-url";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";

interface UserProfileProps {
  profile: RoomUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile: userProfile,
}) => {
  const history = useHistory();
  const [me, setMe] = useAtom(meAtom);
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
  return (
    <>
      <EditProfileModal
        user={profile}
        isOpen={editProfileModalOpen}
        onRequestClose={() => setEditProfileModalOpen(false)}
      />
      <div className={`mb-4 flex justify-between align-center`}>
        <Avatar src={profile.avatarUrl} />
        {me?.id === profile.id ? (
          <div>
            <Button
              onClick={() => {
                setEditProfileModalOpen(true);
              }}
              variant="small"
            >
              edit profile
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
                onFollowUpdater(setCurrentRoom, setMe, me, profile);
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
          <div className={`ml-2 text-simple-gray-3d`}>follows you</div>
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
          <span className={`font-bold`}>{profile.numFollowers}</span> followers
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
          <span className={`font-bold`}>{profile.numFollowing}</span> following
        </button>
      </div>
      <div className="mb-4">
        {profile.bio?.split(" ").map((chunk, i) => {
          if (linkRegex.test(chunk)) {
            try {
              return (
                <a
                  key={i}
                  href={normalizeUrl(chunk)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 p-0"
                >
                  {chunk}{" "}
                </a>
              );
            } catch {}
          }
          return <span key={i}>{chunk} </span>;
        })}
      </div>
    </>
  );
};

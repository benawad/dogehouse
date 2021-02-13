import { useAtom } from "jotai";
import React from "react";
import { useHistory } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { currentRoomAtom, meAtom } from "../atoms";
import { User } from "../types";
import { onFollowUpdater } from "../utils/onFollowUpdater";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

interface UserProfileProps {
  profile: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  const history = useHistory();
  const [me, setMe] = useAtom(meAtom);
  const [, setRoom] = useAtom(currentRoomAtom);
  return (
    <>
      <div className={tw`mb-4 flex justify-between align-center`}>
        <Avatar src={profile.avatarUrl} />
        {me?.id === profile.id ||
        profile.youAreFollowing === null ||
        profile.youAreFollowing === undefined ? null : (
          <div>
            <Button
              onClick={() => {
                wsend({
                  op: "follow",
                  d: {
                    userId: profile.id,
                    value: !profile.youAreFollowing,
                  },
                });
                onFollowUpdater(setRoom, setMe, me, profile);
              }}
              variant="small"
            >
              {profile.youAreFollowing ? "following" : "follow"}
            </Button>
          </div>
        )}
      </div>
      <div className={tw`font-semibold`}>{profile.displayName}</div>
      <div className={tw`my-1 flex`}>
        <div>
          <a href={"https://github.com/" + profile.username} target="_blank">
            @{profile.username}
          </a>
        </div>
        {me?.id !== profile.id && profile.followsYou ? (
          <div
            style={{
              marginLeft: 8,
              color: "--vscode-descriptionForeground",
            }}
          >
            follows you
          </div>
        ) : null}
      </div>
      <div className={tw`flex my-4`}>
        <button
          onClick={() => {
            wsend({
              op: `fetch_follow_list`,
              d: { isFollowing: false, userId: profile.id, cursor: 0 },
            });
            history.push(`/followers/${profile.id}`);
          }}
          className={tw`mr-3`}
        >
          <span className={tw`font-bold`}>
            {profile.numFollowers < 0 ? 0 : profile.numFollowers}
          </span>{" "}
          followers
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
          <span className={tw`font-bold`}>{profile.numFollowing}</span>{" "}
          following
        </button>
      </div>
      <div className={tw`mb-4`}>{profile.bio}</div>
    </>
  );
};

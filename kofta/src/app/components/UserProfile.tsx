import { useAtom } from "jotai";
import normalizeUrl from "normalize-url";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { wsend } from "../../createWebsocket";
import { useConsumerStore } from "../../webrtc/stores/useConsumerStore";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { followerMapAtom, followingMapAtom } from "../atoms";
import { linkRegex } from "../constants";
import { BaseUser, RoomUser } from "../types";
import { onFollowUpdater } from "../utils/onFollowUpdater";
import { useMeQuery } from "../utils/useMeQuery";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { EditProfileModal } from "./EditProfileModal";
import { copyTextToClipboard } from "../utils/copyToClipboard";

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
  const [, setFollowerMap] = useAtom(followerMapAtom);
  const [, setFollowingMap] = useAtom(followingMapAtom);

  const fetchFollowList = (isFollowing: boolean) => {
    const fn = isFollowing ? setFollowingMap : setFollowerMap;
    wsend({
      op: `fetch_follow_list`,
      d: { isFollowing, userId: profile.id, cursor: 0 },
    });
    fn((m) => ({
      ...m,
      [profile.id]: {
        ...m[profile.id],
        loading: true,
      },
    }));
    history.push(`/${isFollowing ? "following" : "followers"}/${profile.id}`);
  };
  const profileUrl = `${window.location.origin}/user/${userProfile.username}`;
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
        <div className="flex items-center">
          <Button
              onClick={() => {
                if(copyTextToClipboard(profileUrl)){
                  toast(t("pages.viewUser.urlCopied"), { type: "success" });
                }
              }}
              variant="small"
            >
              {t("pages.viewUser.copyProfileUrl")}
          </Button>
          {me?.id === profile.id ? (
              <Button
                className="ml-3"
                onClick={() => {
                  setEditProfileModalOpen(true);
                }}
                variant="small"
              >
                {t("pages.viewUser.editProfile")}
              </Button>
          ) : 
          userProfile.youAreFollowing === null ||
          userProfile.youAreFollowing === undefined ? null : (
            <div>
              <Button
                className="ml-3"
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
                {youAreFollowing ? t("pages.viewUser.followingHim") : t("pages.viewUser.followHim")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={`font-semibold`}>{profile.displayName}</div>
      <div className={`my-1 flex`}>
        <div className={`font-mono`}>@{profile.username}</div>
        {me?.id !== profile.id && userProfile.followsYou ? (
          <div className={`ml-2 text-simple-gray-3d`}>
            {t("pages.viewUser.followsYou")}
          </div>
        ) : null}
      </div>
      <div className={`flex my-4`}>
        <button onClick={() => fetchFollowList(false)} className={`mr-3`}>
          <span className={`font-bold`}>{profile.numFollowers}</span>{" "}
          {t("pages.viewUser.followers")}
        </button>
        <button onClick={() => fetchFollowList(true)}>
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

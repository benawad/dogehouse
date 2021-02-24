import { useAtom } from "jotai";
import React, { useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import {
  currentRoomAtom,
  followerMapAtom,
  followingMapAtom,
  meAtom,
} from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";
import { onFollowUpdater } from "../utils/onFollowUpdater";

interface FollowListPageProps {}

export const FollowListPage: React.FC<FollowListPageProps> = () => {
  const { pathname } = useLocation();
  const {
    params: { userId },
  } = useRouteMatch<{ userId: string }>();
  const [followerMap, setFollowerMap] = useAtom(followerMapAtom);
  const [followingMap, setFollowingMap] = useAtom(followingMapAtom);
  const [me, setMe] = useAtom(meAtom);
  const [, setRoom] = useAtom(currentRoomAtom);
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("online");

  const isFollowing = pathname.includes("/following");
  const isFollowingStatus = pathname.includes("/following-status");

  const users = isFollowing
    ? followingMap[userId]?.users || []
    : followerMap[userId]?.users || [];

  const nextCursor = isFollowing
    ? followingMap[userId]?.nextCursor
    : followerMap[userId]?.nextCursor;

  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <BodyWrapper>
        {/* No users found */}
        {!users.length ? <div>no users found</div> : null}

        {/* User status */}
        {isFollowingStatus && users.length ? (
          <div className="flex mb-5 text-lg">
            <button
              className={`mr-5  focus:outline-none ${
                activeTab === "online" ? "text-white-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("online")}
            >
              {users.filter((u) => u.online).length} Online
            </button>
            <button
              className={`mr-5  focus:outline-none ${
                activeTab === "offline" ? "text-white-500" : "text-gray-500 "
              }`}
              onClick={() => setActiveTab("offline")}
            >
              {users.filter((u) => !u.online).length} Offline
            </button>
          </div>
        ) : null}

        {/* Users list */}
        {users.map((profile) =>
          !isFollowingStatus || profile.online === (activeTab === "online") ? (
            <div
              className={`border-b border-solid border-simple-gray-3c flex py-4 px-2 items-center`}
              key={profile.id}
            >
              <button onClick={() => history.push(`/user`, profile)}>
                <Avatar src={profile.avatarUrl} />
              </button>
              <button
                onClick={() => history.push(`/user`, profile)}
                className={`ml-8`}
              >
                <div className={`text-lg`}>{profile.displayName}</div>
                <div style={{ color: "" }}>@{profile.username}</div>
              </button>
              {me?.id === profile.id ||
              profile.youAreFollowing === undefined ||
              profile.youAreFollowing === null ? null : (
                <div className={`ml-auto`}>
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
                      const fn = isFollowing ? setFollowingMap : setFollowerMap;
                      fn((m) => ({
                        ...m,
                        [userId]: {
                          users: m[userId].users.map((u) => {
                            if (profile.id === u.id) {
                              return {
                                ...u,
                                youAreFollowing: !profile.youAreFollowing,
                              };
                            }
                            return u;
                          }),
                          nextCursor: m[userId].nextCursor,
                        },
                      }));
                    }}
                    variant="small"
                  >
                    {profile.youAreFollowing ? "following" : "follow"}
                  </Button>
                </div>
              )}
            </div>
          ) : null
        )}
        {nextCursor ? (
          <div className={`flex justify-center my-10`}>
            <Button
              variant="small"
              onClick={() =>
                wsend({
                  op: `fetch_follow_list`,
                  d: {
                    isFollowing,
                    userId: me?.id,
                    cursor: nextCursor,
                  },
                })
              }
            >
              load more
            </Button>
          </div>
        ) : null}
      </BodyWrapper>
    </Wrapper>
  );
};

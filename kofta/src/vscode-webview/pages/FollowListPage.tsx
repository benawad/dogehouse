import { useAtom } from "jotai";
import React from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { followerMapAtom, followingMapAtom, meAtom } from "../atoms";
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
  const { setCurrentRoom } = useCurrentRoomStore();
  const history = useHistory();

  const isFollowing = pathname.startsWith("/following");

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
        {!users.length ? <div>no users found</div> : null}
        {users.map((profile) => (
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
                    onFollowUpdater(setCurrentRoom, setMe, me, profile);
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
        ))}
        {nextCursor ? (
          <div className={`flex justify-center my-10`}>
            <Button
              variant="small"
              onClick={() =>
                wsend({
                  op: `fetch_follow_list`,
                  d: { isFollowing, userId, cursor: nextCursor },
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

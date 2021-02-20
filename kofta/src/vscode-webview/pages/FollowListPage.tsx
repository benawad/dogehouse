import { useAtom } from "jotai";
import React from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import {
  currentRoomAtom,
  followerMapAtom,
  followingMapAtom,
  meAtom,
} from "../atoms";
import { Avatar } from "../components/Avatar";
import { Backbar } from "../components/Backbar";
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

  const isFollowing = pathname.startsWith("/following");

  const users = isFollowing
    ? followingMap[userId]?.users || []
    : followerMap[userId]?.users || [];

  const nextCursor = isFollowing
    ? followingMap[userId]?.nextCursor
    : followerMap[userId]?.nextCursor;

  return (
    <Wrapper style={{ marginBottom: "auto" }}>
      <Backbar actuallyGoBack />
      <div style={{ padding: "0 var(--container-paddding)" }}>
        {!users.length ? <div>no users found</div> : null}
        {users.map((profile) => (
          <div
            style={{ borderBottom: "1px solid var( --vscode-dropdown-border)" }}
            className={tw`flex py-4 px-2 items-center`}
            key={profile.id}
          >
            <button onClick={() => history.push(`/user`, profile)}>
              <Avatar src={profile.avatarUrl} />
            </button>
            <button
              onClick={() => history.push(`/user`, profile)}
              className={tw`ml-8`}
            >
              <div
                style={{
                  fontSize: "calc(var(--vscode-font-size)*1.1)",
                }}
              >
                {profile.displayName}
              </div>
              <div style={{ color: "" }}>@{profile.username}</div>
            </button>
            {me?.id === profile.id ||
            profile.youAreFollowing === undefined ||
            profile.youAreFollowing === null ? null : (
              <div style={{ marginLeft: "auto" }}>
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
        ))}
        {nextCursor ? (
          <div className={tw`flex justify-center my-10`}>
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
      </div>
    </Wrapper>
  );
};

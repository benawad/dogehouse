import { useRouter } from "next/router";
import React, { useState } from "react";
import { SolidFriends } from "../../icons";
import { isServer } from "../../lib/isServer";
import { ApiPreloadLink } from "../../shared-components/ApiPreloadLink";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { Button } from "../../ui/Button";
import { CenterLoader } from "../../ui/CenterLoader";
import { SingleUser } from "../../ui/UserAvatar";
import { MiddlePanel } from "../layouts/GridPanels";

interface FollowingControllerProps {}

const Page = ({
  cursor,
  isLastPage,
  onLoadMore,
  username,
  isFollowing,
}: {
  isFollowing: boolean;
  username: string;
  cursor: number;
  isLastPage: boolean;
  isOnlyPage: boolean;
  onLoadMore: (o: number) => void;
}) => {
  const conn = useConn();

  const {
    mutateAsync,
    isLoading: followLoading,
    variables,
  } = useTypeSafeMutation("follow");

  const { t } = useTypeSafeTranslation();
  const updater = useTypeSafeUpdateQuery();
  const vars: [string, boolean, number] = [username, isFollowing, cursor];
  const { data, isLoading } = useTypeSafeQuery(
    ["getFollowList", ...vars],
    {
      enabled: !!username && !isServer,
      staleTime: Infinity,
      refetchOnMount: "always",
    },
    vars
  );

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data || data.users.length === 0) {
    const styles = "text-primary-200 text-center";
    if (isFollowing) return <div className={styles}>Not following anyone</div>;
    else return <div className={styles}>No followers</div>;
  }

  // if (isOnlyPage && data.rooms.length === 0) {
  //   return (
  //     <Button variant="small" onClick={() => refetch()}>
  //       {t("pages.home.refresh")}
  //     </Button>
  //   );
  // }

  return (
    <>
      {data.users.map((user) => (
        <div key={user.id} className="flex items-center mb-6">
          <div className="flex">
            <SingleUser size="md" src={user.avatarUrl} />
          </div>
          <div className="flex px-4 flex-1">
            <ApiPreloadLink route="profile" data={{ username: user.username }}>
              <div className="flex flex-col w-full">
                <div className="block max-w-md text-primary-100 truncate w-full">
                  {user.displayName}
                </div>
                <div className="flex text-primary-200">@{user.username}</div>
              </div>
            </ApiPreloadLink>
          </div>
          <div className="flex block">
            {conn.user.username !== user.username && (
              <Button
                loading={followLoading && variables?.[0] === user.id}
                onClick={async () => {
                  await mutateAsync([user.id, !user.youAreFollowing]);
                  updater(["getFollowList", ...vars], (x) =>
                    !x
                      ? x
                      : {
                          ...x,
                          users: x.users.map((u) =>
                            u.id === user.id
                              ? {
                                  ...u,
                                  numFollowers:
                                    u.numFollowers +
                                    (user.youAreFollowing ? -1 : 1),
                                  youAreFollowing: !user.youAreFollowing,
                                }
                              : u
                          ),
                        }
                  );
                }}
                size="small"
                color={user.youAreFollowing ? "secondary" : "primary"}
                icon={user.youAreFollowing ? null : <SolidFriends />}
              >
                {user.youAreFollowing
                  ? t("pages.viewUser.unfollow")
                  : t("pages.viewUser.followHim")}
              </Button>
            )}
          </div>
        </div>
      ))}
      {isLastPage && data.nextCursor ? (
        <div className={`flex justify-center py-5`}>
          <Button
            size="small"
            onClick={() => {
              onLoadMore(data.nextCursor!);
            }}
          >
            {t("common.loadMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export const FollowingController: React.FC<FollowingControllerProps> = ({}) => {
  const { pathname, query } = useRouter();
  const isFollowing = pathname.includes("/following");
  const username = typeof query.username === "string" ? query.username : "";
  const [cursors, setCursors] = useState([0]);

  return (
    <MiddlePanel>
      {cursors.map((cursor, i) => (
        <Page
          username={username}
          isFollowing={isFollowing}
          key={cursor}
          cursor={cursor}
          isOnlyPage={cursors.length === 1}
          onLoadMore={(c) => setCursors([...cursors, c])}
          isLastPage={i === cursors.length - 1}
        />
      ))}
    </MiddlePanel>
  );
};

import { useRouter } from "next/router";
import React, { useState } from "react";
import { SolidFriends } from "../../icons";
import { isServer } from "../../lib/isServer";
import { ApiPreloadLink } from "../../shared-components/ApiPreloadLink";
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

  if (!data) {
    return null;
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
        <div key={user.id} className="items-center mb-6">
          <div>
            <SingleUser size="md" src={user.avatarUrl} />
          </div>
          <div className="px-4 flex-1">
            <ApiPreloadLink route="profile" data={{ username: user.username }}>
              <div className="flex-col w-full">
                <p className="block max-w-md text-primary-100 truncate w-full">
                  {user.displayName}
                </p>
                <div className="text-primary-200">@{user.username}</div>
              </div>
            </ApiPreloadLink>
          </div>
          <div className="block">
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

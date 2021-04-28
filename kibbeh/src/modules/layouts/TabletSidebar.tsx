import React, { useState } from "react";
import { SolidPlus } from "../../icons";
import { ApiPreloadLink } from "../../shared-components/ApiPreloadLink";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { BoxedIcon } from "../../ui/BoxedIcon";
import { SingleUser } from "../../ui/UserAvatar";

interface FriendsOnlineControllerProps {}

const Page: React.FC<{
  cursor: number;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}> = ({ cursor, isLastPage, isOnlyPage, onLoadMore }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getMyFollowing", cursor],
    {
      refetchOnMount: "always",
    },
    [cursor]
  );

  if (isOnlyPage && !isLoading && !data?.users.length) {
    return null;
  }

  return (
    <>
      {data?.users.map((u) => (
        <div key={u.id} className="flex pb-3 w-full justify-center">
          <ApiPreloadLink route="profile" data={{ username: u.username }}>
            <SingleUser
              size="sm"
              isOnline={u.online}
              src={u.avatarUrl}
              username={u.username}
            />
          </ApiPreloadLink>
        </div>
      ))}
      {isLastPage && data?.nextCursor ? (
        <div className="flex justify-center">
          <BoxedIcon circle onClick={() => onLoadMore(data!.nextCursor!)}>
            <SolidPlus />
          </BoxedIcon>
        </div>
      ) : null}
    </>
  );
};

export const TabletSidebar: React.FC<FriendsOnlineControllerProps> = ({}) => {
  const [cursors, setCursors] = useState<number[]>([0]);
  const conn = useConn();

  if (!conn) {
    return null;
  }

  return (
    <div
      data-testid="tablet-sidebar-container"
      className="pb-5 w-full flex flex-col flex-1 overflow-y-auto text-primary-100"
    >
      {cursors.map((c, i) => (
        <Page
          key={c}
          cursor={c}
          onLoadMore={(nc) => setCursors([...cursors, nc])}
          isLastPage={i === cursors.length - 1}
          isOnlyPage={cursors.length === 1}
        />
      ))}
    </div>
  );
};

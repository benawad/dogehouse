import React, { useState } from "react";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import {
  FollowerOnline,
  FollowersOnlineShowMore,
  FollowersOnlineWrapper,
} from "../../ui/FollowersOnline";
import { InfoText } from "../../ui/InfoText";

interface FriendsOnlineControllerProps {}

const Page: React.FC<{
  cursor: number;
  onLoadMore: (cursor: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}> = ({ cursor, isLastPage, isOnlyPage, onLoadMore }) => {
  const { t } = useTypeSafeTranslation();
  const { data, isLoading } = useTypeSafeQuery(
    ["getMyFollowing", cursor],
    {
      refetchOnMount: "always",
    },
    [cursor]
  );

  if (isOnlyPage && !isLoading && !data?.users.length) {
    return <InfoText>{t("components.followingOnline.noOnline")}</InfoText>;
  }

  return (
    <>
      {data?.users.map((u) => (
        <FollowerOnline {...u} key={u.id} />
      ))}
      {isLastPage && data?.nextCursor ? (
        <FollowersOnlineShowMore
          onClick={() => onLoadMore(data!.nextCursor!)}
        />
      ) : null}
    </>
  );
};

export const FollowingOnlineController: React.FC<FriendsOnlineControllerProps> = ({}) => {
  const [cursors, setCursors] = useState<number[]>([0]);
  const conn = useConn();

  if (!conn) {
    return null;
  }

  return (
    <FollowersOnlineWrapper>
      {cursors.map((c, i) => (
        <Page
          key={c}
          cursor={c}
          onLoadMore={(nc) => setCursors([...cursors, nc])}
          isLastPage={i === cursors.length - 1}
          isOnlyPage={cursors.length === 1}
        />
      ))}
    </FollowersOnlineWrapper>
  );
};

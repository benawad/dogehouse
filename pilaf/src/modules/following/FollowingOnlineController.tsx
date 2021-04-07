import React, { useState } from "react";
import { Text } from "react-native";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { FollowerOnline, FollowersOnlineWrapper } from "./FollowersOnline";

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
      refetchOnWindowFocus: true,
    },
    [cursor]
  );

  if (isOnlyPage && !isLoading && !data?.users.length) {
    return <Text>You have 0 friends online right now</Text>;
  }

  return (
    <>
      {data?.users.map((u) => (
        <FollowerOnline {...u} key={u.id} />
      ))}
      {/* {isLastPage && data?.nextCursor ? (
        <FollowersOnlineShowMore
          onClick={() => onLoadMore(data!.nextCursor!)}
        />
      ) : null} */}
    </>
  );
};

export const FollowingOnlineController: React.FC<FriendsOnlineControllerProps> = ({}) => {
  const [cursors, setCursors] = useState<number[]>([0]);

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

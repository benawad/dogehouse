import React from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { FollowersOnline } from "../../ui/FollowersOnline";

interface FriendsOnlineControllerProps {}

export const FollowingOnlineController: React.FC<FriendsOnlineControllerProps> = ({}) => {
  const { data } = useTypeSafeQuery("getFollowingOnline", {
    refetchOnMount: "always",
  });

  return <FollowersOnline onlineFriendList={(data?.users || []) as any} />;
};

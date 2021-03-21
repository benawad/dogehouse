import React from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { FriendsOnline } from "../../ui/FriendsOnline";

interface FriendsOnlineControllerProps {}

export const FriendsOnlineController: React.FC<FriendsOnlineControllerProps> = ({}) => {
  const { data } = useTypeSafeQuery("getFollowingOnline", {
    refetchOnMount: "always",
  });

  return <FriendsOnline onlineFriendList={data?.users || []} />;
};

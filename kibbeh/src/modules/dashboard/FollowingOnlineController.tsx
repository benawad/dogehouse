import React from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { FriendsOnline } from "../../ui/FriendsOnline";

interface FriendsOnlineControllerProps {}

export const FollowingOnlineController: React.FC<FriendsOnlineControllerProps> = ({}) => {
  const { data } = useTypeSafeQuery("getFollowingOnline", {
    refetchOnMount: "always",
  });

  return (
    <div>
      <FriendsOnline onlineFriendList={(data?.users || []) as any} />
    </div>
  );
};

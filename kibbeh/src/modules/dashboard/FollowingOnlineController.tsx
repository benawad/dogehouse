import React, { useState } from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { FollowersOnline } from "../../ui/FollowersOnline";

interface FriendsOnlineControllerProps {}

const Page = () => {};

export const FollowingOnlineController: React.FC<FriendsOnlineControllerProps> = ({}) => {
  // const [cursors, setCursors = useState([])
  const { data } = useTypeSafeQuery("getMyFollowing", {
    refetchOnMount: "always",
  });

  return <FollowersOnline onlineFriendList={data?.users || []} />;
};

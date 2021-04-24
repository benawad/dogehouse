import React from "react";
import { UserWithFollowInfo } from "@dogehouse/kebab";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileAbout } from "./ProfileAbout";
import { ProfileTabs } from "./ProfileTabs";

interface UserProfileProps {
  user: UserWithFollowInfo;
  isCurrentUser?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isCurrentUser,
}) => {
  return (
    <>
      <ProfileHeader
        user={user}
        pfp={user.avatarUrl}
        displayName={user.displayName}
        isCurrentUser={isCurrentUser}
        username={user.username}
      />
      <ProfileTabs className="mt-4" activeTab="about" />
      <ProfileAbout
        className={"mt-2"}
        username={user.username}
        followers={user.numFollowers}
        following={user.numFollowing}
        description={user.bio}
        tags={[]}
      />
    </>
  );
};

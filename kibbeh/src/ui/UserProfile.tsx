import React from "react";
import { UserWithFollowInfo } from "@dogehouse/kebab";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileAbout } from "./ProfileAbout";
import { ProfileTabs } from "./ProfileTabs";
import { badge } from "./UserSummaryCard";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { UserBadgeLgProps } from "./UserBadgeLg";

interface UserProfileProps {
  user: UserWithFollowInfo;
  isCurrentUser?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isCurrentUser,
}) => {
  const { t } = useTypeSafeTranslation();
  const badges: badge[] = [];
  const tags: UserBadgeLgProps[] = [];
  if (user.staff) {
    badges.push({
      content: "ƉS",
      variant: "primary",
      color: "white",
      title: t("components.userBadges.dhStaff"),
    });
    tags.push({
      icon: "dogeStaff",
      children: t("components.userBadges.dhStaff"),
    });
  }
  if (user.contributions > 0) {
    badges.push({
      content: "ƉC",
      variant: "primary",
      color: "white",
      title: t("components.userBadges.dhContributor"),
    });
    tags.push({
      icon: "dogeContributor",
      children: t("components.userBadges.dhContributor"),
    });
  }

  if (user.botOwnerId) {
    badges.push({
      content: t("pages.viewUser.bot"),
      variant: "primary",
      color: "white",
      title: t("pages.viewUser.bot"),
    });
  }
  return (
    <>
      <ProfileHeader
        user={user}
        pfp={user.avatarUrl}
        displayName={user.displayName}
        isCurrentUser={isCurrentUser}
        username={user.username}
        badges={badges}
      />
      <ProfileTabs className="mt-4" activeTab="about" />
      <ProfileAbout
        className={"mt-2"}
        username={user.username}
        followers={user.numFollowers}
        following={user.numFollowing}
        description={user.bio}
        tags={tags}
      />
    </>
  );
};

import React from "react";
import { UserWithFollowInfo } from "@dogehouse/kebab";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileAbout } from "./ProfileAbout";
import { ProfileTabs } from "./ProfileTabs";
import { badge } from "./UserSummaryCard";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { UserBadgeLgProps } from "./UserBadgeLg";
import { ContributorBadge, StaffBadge } from "../icons/badges";

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
      content: <StaffBadge />,
      variant: "primary",
      color: "white",
      title: t("components.userBadges.dhStaff"),
      naked: true,
    });
    tags.push({
      icon: "dogeStaff",
      children: t("components.userBadges.dhStaff"),
    });
  }

  if (user.contributions > 0) {
    badges.push({
      content: <ContributorBadge contributions={user.contributions} />,
      variant: "primary",
      color: "white",
      title: `${t("components.userBadges.dhContributor")} (${user.contributions} ${t("pages.admin.contributions")})`,
      naked: true,
    });
    tags.push({
      icon: "dogeContributor",
      contributions: user.contributions,
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
      <ProfileTabs user={user} className="mt-4" aboutTags={tags} />
    </>
  );
};

import React, { useEffect, useState } from "react";
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
  const [badges, setBadges] = useState<Array<badge>>([]);
  const [tags, setTags] = useState<Array<UserBadgeLgProps>>([]);
  useEffect(() => {
    if (user.staff) {
      setBadges((b) =>
        b.concat({
          content: "ƉS",
          variant: "primary",
          color: "white",
          title: "DogeHouse Staff",
        })
      );

      setTags((ot) =>
        ot.concat({
          icon: "dogeStaff",
          children: "DogeHouse Staff",
        })
      );
    }
    if (user.contributions > 0) {
      setBadges((b) =>
        b.concat({
          content: "ƉC",
          variant: "primary",
          color: "white",
          title: "DogeHouse Contributor",
        })
      );

      setTags((ot) =>
        ot.concat({
          icon: "dogeContributor",
          children: "DogeHouse Contributor",
        })
      );
    }

    if (user.botOwnerId) {
      setBadges((b) =>
        b.concat({
          content: t("pages.viewUser.bot"),
          variant: "primary",
          color: "white",
          title: t("pages.viewUser.bot"),
        })
      );
    }
  }, [user]);
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

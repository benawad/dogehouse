import React, { ReactChild, useState } from "react";
import { ProfileHeaderWrapper } from "./ProfileHeaderWrapper";
import { Button } from "./Button";
import { UserBadge } from "./UserBadge";
import { SingleUser } from "./UserAvatar/SingleUser";
import {
  SolidCompass,
  SolidFriends,
  SolidMessages,
  SolidPersonAdd,
} from "../icons";
import { useTypeSafeMutation } from "../shared-hooks/useTypeSafeMutation";
import { UserWithFollowInfo } from "@dogehouse/kebab";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../shared-hooks/useTypeSafeUpdateQuery";
import { EditProfileModal } from "../modules/user/EditProfileModal";
import { usePreloadPush } from "../shared-components/ApiPreloadLink";

export interface ProfileHeaderProps {
  displayName: string;
  username: string;
  children?: ReactChild;
  pfp?: string;
  canDM?: boolean;
  isCurrentUser?: boolean;
  user: UserWithFollowInfo;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  username,
  user,
  children,
  canDM,
  isCurrentUser,
  pfp = "https://dogehouse.tv/favicon.ico",
}) => {
  const {
    mutateAsync,
    isLoading: followLoading,
    variables,
  } = useTypeSafeMutation("follow");

  const { t } = useTypeSafeTranslation();
  const updater = useTypeSafeUpdateQuery();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const preloadPush = usePreloadPush();
  const update = useTypeSafeUpdateQuery();
  return (
    // @TODO: Add the cover api (once it's implemented)}
    <ProfileHeaderWrapper
      coverUrl={user.bannerUrl || "https://source.unsplash.com/random"}
    >
      <EditProfileModal
        isOpen={showEditProfileModal}
        onRequestClose={() => setShowEditProfileModal(false)}
        onEdit={(d) => {
          update(["getUserProfile", d.username], (x) =>
            !x ? x : { ...x, ...d }
          );
          if (d.username !== username) {
            preloadPush({
              route: "profile",
              data: { username: d.username },
            });
          }
        }}
      />
      <div className="flex mr-4 ">
        <SingleUser
          isOnline={user.online}
          className="absolute flex-none -top-5.5 rounded-full shadow-outlineLg"
          src={pfp}
        />
      </div>
      <div className="flex flex-col w-3/6 font-sans">
        <h4 className="text-primary-100 font-bold truncate">{displayName}</h4>
        <div className="flex flex-row items-center">
          <p
            className="text-primary-300 mr-2"
            data-testid="profile-info-username"
          >{`@${username}`}</p>
          {user.isBot ? (
            <UserBadge color="grey">{t("pages.viewUser.bot")}</UserBadge>
          ) : (
            ""
          )}
          {user.followsYou ? (
            <UserBadge color="grey">{t("pages.viewUser.followsYou")}</UserBadge>
          ) : (
            ""
          )}
        </div>
        <div className="mt-2">{children}</div>
      </div>
      <div className="w-3/6 ">
        <div className="flex flex-row justify-end content-end gap-2">
          {!isCurrentUser && (
            <Button
              loading={false}
              onClick={async () => {
                await mutateAsync([user.id, !user.youAreFollowing]);
                updater(["getUserProfile", username], (u) =>
                  !u
                    ? u
                    : {
                        ...u,
                        numFollowers:
                          u.numFollowers + (user.youAreFollowing ? -1 : 1),
                        youAreFollowing: !user.youAreFollowing,
                      }
                );
              }}
              size="small"
              color={user.youAreFollowing ? "secondary" : "primary"}
              icon={user.youAreFollowing ? null : <SolidFriends />}
            >
              {user.youAreFollowing
                ? t("pages.viewUser.unfollow")
                : t("pages.viewUser.followHim")}
            </Button>
          )}
          {isCurrentUser ? (
            <Button
              size="small"
              color="secondary"
              onClick={() => setShowEditProfileModal(true)}
              icon={<SolidCompass />}
            >
              {t("pages.viewUser.editProfile")}
            </Button>
          ) : (
            ""
          )}
          {canDM ? (
            <Button size="small" color="secondary" icon={<SolidMessages />}>
              Send DM
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </ProfileHeaderWrapper>
  );
};

import React, { ReactChild, useEffect, useState } from "react";
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
import { badge, Badges } from "./UserSummaryCard";

export interface ProfileHeaderProps {
  displayName: string;
  username: string;
  children?: ReactChild;
  pfp?: string;
  canDM?: boolean;
  isCurrentUser?: boolean;
  user: UserWithFollowInfo;
  badges?: badge[];
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  username,
  user,
  children,
  canDM,
  isCurrentUser,
  pfp = "https://dogehouse.tv/favicon.ico",
  badges = [],
}) => {
  const { mutateAsync, isLoading: followLoading } = useTypeSafeMutation(
    "follow"
  );
  const {
    mutateAsync: unblock,
    isLoading: unblockLoading,
  } = useTypeSafeMutation("userUnblock");
  const { mutateAsync: block, isLoading: blockLoading } = useTypeSafeMutation(
    "userBlock"
  );

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
          className="absolute flex-none -top-5.5 rounded-full shadow-outlineLg bg-primary-900"
          src={pfp}
        />
      </div>
      <div className="flex flex-col w-3/6 font-sans">
        <h4 className="text-primary-100 font-bold truncate">
          {displayName || username}
        </h4>
        <div className="flex flex-row items-center">
          <p
            className="text-primary-300 mr-2"
            data-testid="profile-info-username"
          >{`@${username}`}</p>

          {user.followsYou && (
            <UserBadge color="grey" variant="primary-700">
              {t("pages.viewUser.followsYou")}
            </UserBadge>
          )}
        </div>
        <div className="mt-2 flex">
          <Badges badges={badges} />
          {children}
        </div>
      </div>

      <div className="sm:w-3/6">
        <div className="flex flex-row justify-end content-end gap-2">
          {!isCurrentUser && (
            <Button
              loading={blockLoading || unblockLoading}
              size="small"
              color={user.iBlockedThem ? "secondary" : "primary"}
              onClick={async () => {
                if (user.iBlockedThem) {
                  await unblock([user.id]);
                  updater(["getUserProfile", username], (u) =>
                    !u
                      ? u
                      : {
                          ...u,
                          iBlockedThem: false,
                        }
                  );
                } else {
                  await block([user.id]);
                  updater(["getUserProfile", username], (u) =>
                    !u
                      ? u
                      : {
                          ...u,
                          iBlockedThem: true,
                        }
                  );
                }
              }}
            >
              {user.iBlockedThem
                ? t("pages.viewUser.unblock")
                : t("pages.viewUser.block")}
            </Button>
          )}
          {!isCurrentUser && (
            <Button
              loading={followLoading}
              onClick={async () => {
                await mutateAsync([user.id, !user.youAreFollowing]);
                updater(["getUserProfile", username], (u) =>
                  !u || "error" in u
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
              {t("pages.viewUser.sendDM")}
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </ProfileHeaderWrapper>
  );
};

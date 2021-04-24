import React, { ReactChild } from "react";
import { ProfileHeaderWrapper } from "./ProfileHeaderWrapper";
import { Button } from "./Button";
import { UserBadge } from "./UserBadge";
import { SingleUser } from "./UserAvatar/SingleUser";
import { SolidMessages, SolidPersonAdd } from "../icons";

import profileCover from "../stories/img/profile-cover.png";
import src from "../img/avatar.png";

export interface ProfileHeaderProps {
  displayName: string;
  username: string;
  isFollowing?: boolean;
  doesFollow?: boolean;
  isOnline?: boolean;
  children?: ReactChild;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  username,
  isFollowing = true,
  doesFollow = true,
  isOnline = true,
  children,
}) => {
  return (
    <ProfileHeaderWrapper coverUrl={profileCover}>
      <div className="flex mr-4 ">
        <SingleUser
          isOnline={isOnline}
          className="absolute flex-none -top-5.5 rounded-full shadow-avator"
          src={src}
        />
      </div>
      <div className="flex flex-col w-3/6 font-sans">
        <h4 className="text-primary-100 font-bold">{displayName}</h4>
        <div className="flex flex-row items-center">
          <p className="text-primary-300 mr-2">{username}</p>
          {isFollowing ?? <UserBadge color="grey">Follows you</UserBadge>}
        </div>
        <div className="mt-2">{children}</div>
      </div>
      <div className="w-3/6 ">
        <div className="flex flex-row justify-end content-end gap-2">
          {doesFollow && (
            <Button size="small" icon={<SolidPersonAdd />}>
              Follow
            </Button>
          )}
          <Button size="small" color="secondary" icon={<SolidMessages />}>
            Send DM
          </Button>
        </div>
      </div>
    </ProfileHeaderWrapper>
  );
};

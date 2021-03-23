import { BaseUser } from "@dogehouse/kebab";
import React from "react";
import { kFormatter } from "../lib/kFormatter";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { SingleUser } from "./UserAvatar";

interface VerticalUserInfoProps {
  user: BaseUser;
}

export const VerticalUserInfo: React.FC<VerticalUserInfoProps> = ({ user }) => {
  const { t } = useTypeSafeTranslation();
  return (
    <div className="flex-col rounded-8 p-4 w-full items-center">
      <SingleUser size="default" src={user.avatarUrl} />
      <div className="mt-2">
        <span className="text-sm text-primary-100 font-bold">
          {user.displayName}
        </span>
        <span className="text-sm text-primary-300 ml-1">@{user.username}</span>
        {/* <Badges badges={badges} /> */}
      </div>
      <div className="mt-2">
        <div>
          <span className="text-primary-100 font-bold">
            {kFormatter(user.numFollowers)}
          </span>{" "}
          <span className="text-primary-300 ml-1">
            {t("pages.viewUser.followers")}
          </span>
        </div>
        <div className="ml-4">
          <span className="text-primary-100 font-bold">
            {kFormatter(user.numFollowing)}
          </span>
          <span className="text-primary-300 ml-1">
            {" "}
            {t("pages.viewUser.following")}
          </span>
        </div>
      </div>
      <div className="text-primary-300 mt-2 text-center">{user.bio}</div>
    </div>
  );
};

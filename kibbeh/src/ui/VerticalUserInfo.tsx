import { BaseUser } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import React from "react";
import { linkRegex } from "../lib/constants";
import { kFormatter } from "../lib/kFormatter";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { SingleUser } from "./UserAvatar";

interface VerticalUserInfoProps {
  user: BaseUser;
}

export const VerticalUserInfo: React.FC<VerticalUserInfoProps> = ({ user }) => {
  const { t } = useTypeSafeTranslation();
  return (
    <div className="flex-col rounded-8 pt-5 px-6 pb-4 w-full items-center">
      <SingleUser size="default" src={user.avatarUrl} />
      <div className="mt-2">
        <span className="text-primary-100 font-bold">{user.displayName}</span>
        <span className="text-primary-300 ml-1">@{user.username}</span>
        {/* <Badges badges={badges} /> */}
      </div>
      <div className="mt-2">
        <div>
          <ApiPreloadLink route="following" data={{ username: user.username }}>
            <span className="text-primary-100 font-bold">
              {kFormatter(user.numFollowers)}
            </span>{" "}
            <span className="text-primary-300 ml-1">
              {t("pages.viewUser.followers")}
            </span>
          </ApiPreloadLink>
        </div>
        <div className="ml-4">
          <ApiPreloadLink route="followers" data={{ username: user.username }}>
            <span className="text-primary-100 font-bold">
              {kFormatter(user.numFollowing)}
            </span>
            <span className="text-primary-300 ml-1">
              {" "}
              {t("pages.viewUser.following")}
            </span>
          </ApiPreloadLink>
        </div>
      </div>
      <div className="text-primary-300 mt-2 text-center inline">
        {user.bio.split(" ").map((chunk, i) => {
          try {
            return linkRegex.test(chunk) ? (
              <a
                href={normalizeUrl(chunk)}
                rel="noreferrer"
                className="text-accent hover:underline inline"
                key={i}
                target="_blank"
              >
                {chunk}&nbsp;
              </a>
            ) : (
              chunk
            );
          } catch (err) {}
        })}
      </div>
    </div>
  );
};

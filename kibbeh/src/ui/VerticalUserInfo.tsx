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
    <div className="flex-col items-center w-full px-6 pt-5 pb-4 rounded-8">
      <SingleUser
        size="default"
        src={user.avatarUrl}
        username={user.username}
      />
      <div className="mt-2">
        <span className="h-full font-bold break-all text-primary-100 line-clamp-1">
          {user.displayName}
        </span>
        <span className="ml-1 text-primary-300">@{user.username}</span>
        {/* <Badges badges={badges} /> */}
      </div>
      <div className="mt-2">
        <div>
          <ApiPreloadLink route="following" data={{ username: user.username }}>
            <span className="font-bold text-primary-100">
              {kFormatter(user.numFollowing)}
            </span>{" "}
            <span className="ml-1 text-primary-300">
              {t("pages.viewUser.following")}
            </span>
          </ApiPreloadLink>
        </div>
        <div className="ml-4">
          <ApiPreloadLink route="followers" data={{ username: user.username }}>
            <span className="font-bold text-primary-100">
              {kFormatter(user.numFollowers)}
            </span>
            <span className="ml-1 text-primary-300">
              {" "}
              {t("pages.viewUser.followers")}
            </span>
          </ApiPreloadLink>
        </div>
      </div>
      <div className="w-full mt-2">
        <p className="inline w-full mt-2 text-center break-words whitespace-pre-wrap text-primary-300">
          {user.bio.split(/\n/).map((line, i) => (
            <span key={i} className="flex justify-center">
              {line.split(" ").map((chunk, j) => {
                try {
                  return linkRegex.test(chunk) ? (
                    <a
                      href={normalizeUrl(chunk)}
                      rel="noreferrer"
                      className="inline text-center text-accent hover:underline"
                      key={`${i}${j}`}
                      target="_blank"
                    >
                      {chunk}&nbsp;
                    </a>
                  ) : (
                    `${chunk} `
                  );
                } catch (err) {}
              })}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

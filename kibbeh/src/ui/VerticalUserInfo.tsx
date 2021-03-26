import { BaseUser } from "@dogehouse/kebab";
import React from "react";
import { kFormatter } from "../lib/kFormatter";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { SingleUser } from "./UserAvatar";
import { linkRegex } from "../../src/lib/constants";
import normalizeUrl from "normalize-url";

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
      <div className="text-primary-300 mt-2 w-full whitespace-pre-wrap break-all flex flex-col">
        {user.bio?.split(/\n/gm).map((line, i) => {
          return (
            <div key={i}>
              <span>
                {line.split(" ").map((chunk, j) => {
                  if (linkRegex.test(chunk)) {
                    try {
                      return (
                        <a
                          key={`${i}${j}`}
                          href={normalizeUrl(chunk)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent p-0 hover:underline"
                        >
                          {chunk}{" "}
                        </a>
                      );
                    } catch {}
                  }
                  return <span key={`${i}${j}`}>{chunk} </span>;
                })}
              </span>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

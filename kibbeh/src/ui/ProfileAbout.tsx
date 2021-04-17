import React from "react";
import { SolidLink } from "../icons";
import { kFormatter } from "../lib/kFormatter";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { UserBadgeLg, UserBadgeLgProps } from "./UserBadgeLg";

export interface ProfileAboutProps {
  username: string;
  followers: number;
  following: number;
  description?: string;
  link?: string;
  tags: UserBadgeLgProps[];
}

export const ProfileAbout: React.FC<ProfileAboutProps> = ({
  username,
  followers,
  following,
  description,
  link,
  tags,
}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <div
      className="bg-primary-800 p-4 rounded-8 w-full leading-8"
      style={{ maxWidth: 640 }}
    >
      <p className="text-primary-100 font-bold text-xl pb-4">
        About {username}
      </p>
      <div className="flex mb-2">
        <div className="flex">
          <ApiPreloadLink route="followers" data={{ username }}>
            <span className="text-primary-100 font-bold">
              {kFormatter(followers)}
            </span>
            <span className="text-primary-300 ml-1 lowercase">
              {t("pages.viewUser.followers")}
            </span>
          </ApiPreloadLink>
        </div>
        <div className="flex ml-4">
          <ApiPreloadLink route="following" data={{ username }}>
            <span className="text-primary-100 font-bold">
              {kFormatter(following)}
            </span>
            <span className="text-primary-300 ml-1 lowercase">
              {t("pages.viewUser.following")}
            </span>
          </ApiPreloadLink>
        </div>
      </div>
      <p className="text-primary-100 text-sm pb-2">{description}</p>
      {link && (
        <div className="flex flex-row items-center mb-4">
          <SolidLink className="mr-2" />
          <a
            className="text-accent font-bold text-sm"
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {link.replace(/(^\w+:|^)\/\//, "")}
          </a>
        </div>
      )}
      {tags.map((props: UserBadgeLgProps) => (
        <div key={props.icon} className="mb-1">
          <UserBadgeLg {...props} />
        </div>
      ))}
    </div>
  );
};

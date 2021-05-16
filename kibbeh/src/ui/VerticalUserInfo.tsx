import { UserWithFollowInfo } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import React from "react";
import { linkRegex } from "../lib/constants";
import { kFormatter } from "../lib/kFormatter";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { SingleUser } from "./UserAvatar";
import { HeaderController } from "../modules/display/HeaderController";
import { UserBadge } from "./UserBadge";
import { badge, Badges } from "./UserSummaryCard";
import { ContributorBadge, StaffBadge } from "../icons/badges";

interface VerticalUserInfoProps {
  user: UserWithFollowInfo;
}

export const VerticalUserInfo: React.FC<VerticalUserInfoProps> = ({ user }) => {
  const { t } = useTypeSafeTranslation();
  const badges: badge[] = [];
  if (user.staff) {
    badges.push({
      content: <StaffBadge />,
      variant: "primary",
      color: "white",
      title: t("components.userBadges.dhStaff"),
      naked: true,
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
  }

  if (user.botOwnerId) {
    badges.push({
      content: t("pages.viewUser.bot"),
      variant: "primary",
      color: "white",
      title: t("pages.viewUser.bot"),
    });
  }

  if (user.followsYou) {
    badges.push({
      content: t("pages.viewUser.followsYou"),
      variant: "primary-700",
      color: "grey",
      title: t("pages.viewUser.followsYou"),
      classname: "ml-1",
    });
  }
  return (
    <>
      <HeaderController
        embed={{}}
        title={`${user.displayName} (@${user.username})`}
      />
      <div className="flex flex-col rounded-8 pt-5 px-6 pb-4 w-full items-center">
        <ApiPreloadLink route="profile" data={{ username: user.username }}>
          <SingleUser
            size="default"
            src={user.avatarUrl}
            username={user.username}
            hover={true}
          />
        </ApiPreloadLink>
        <ApiPreloadLink route="profile" data={{ username: user.username }}>
          <div className="flex mt-2 max-w-full">
            <span className="flex text-primary-100 font-bold h-full break-all line-clamp-1 truncate">
              {user.displayName}
            </span>
            <span
              data-testid="profile-info-username"
              className="flex text-primary-300 ml-1 hover:underline"
            >
              @{user.username}
            </span>
          </div>
        </ApiPreloadLink>
        <span className="flex justify-center mt-2">
          <Badges badges={badges} />
        </span>

        <div className="flex mt-2">
          <div className="flex">
            <ApiPreloadLink
              route="followers"
              data={{ username: user.username }}
            >
              <span className="text-primary-100 font-bold">
                {kFormatter(user.numFollowers)}
              </span>
              <span className="text-primary-300 lowercase ml-1.5">
                {t("pages.viewUser.followers")}
              </span>
            </ApiPreloadLink>
          </div>
          <div className="flex ml-4">
            <ApiPreloadLink
              route="following"
              data={{ username: user.username }}
            >
              <span className="text-primary-100 font-bold">
                {kFormatter(user.numFollowing)}
              </span>
              <span className="text-primary-300 lowercase ml-1.5">
                {t("pages.viewUser.following")}
              </span>
            </ApiPreloadLink>
          </div>
        </div>
        <div className="flex w-full mt-2">
          {/* Tailwind's max-height is not working, so I used style */}
          <p
            className="text-primary-300 mt-2 text-center w-full whitespace-pre-wrap break-words inline overflow-y-auto"
            style={{ maxHeight: "300px" }}
          >
            {user.bio &&
              user.bio.split(/\n/).map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 ? <br key={i} /> : null}
                  {line.split(" ").map((chunk, j) => {
                    try {
                      return linkRegex.test(chunk) ? (
                        <a
                          href={normalizeUrl(chunk)}
                          rel="noreferrer"
                          className="text-accent text-center hover:underline inline"
                          key={`${i}${j}`}
                          target="_blank"
                        >
                          {chunk}&nbsp;
                        </a>
                      ) : (
                        <React.Fragment
                          key={`${i}${j}`}
                        >{`${chunk} `}</React.Fragment>
                      );
                    } catch (err) {}

                    return null;
                  })}
                </React.Fragment>
              ))}
          </p>
        </div>
      </div>
    </>
  );
};

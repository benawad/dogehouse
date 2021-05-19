import { UserWithFollowInfo } from "@dogehouse/kebab";
import React, { useState } from "react";
import { useConn } from "../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { ProfileAbout } from "./ProfileAbout";
import { ProfileAdmin } from "./ProfileAdmin";
import { ProfileScheduled } from "./ProfileScheduled";
import { UserBadgeLgProps } from "./UserBadgeLg";

export interface ProfileTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserWithFollowInfo;
  tabs?: {
    about?: boolean;
    rooms?: boolean;
    scheduled?: boolean;
    recorded?: boolean;
    clips?: boolean;
  };
  aboutTags?: UserBadgeLgProps[];
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  className,
  user,
  tabs = {
    about: true,
    scheduled: true,
    rooms: false,
    recorded: false,
    clips: false,
  },
  aboutTags = [],
  ...props
}) => {
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useTypeSafeTranslation();
  const conn = useConn();
  return (
    <>
      <div
        className={`w-full flex items-center justify-around ${className}`}
        {...props}
      >
        <button
          className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "about" && `border-accent text-accent`} ${
            !tabs.about ? "hidden" : ""
          }`}
          data-testid={`user:${user.username}:tab:about`}
          onClick={() => setActiveTab("about")}
        >
          {t("pages.viewUser.profileTabs.about")}
        </button>

        <button
          className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "rooms" && `border-accent text-accent`} ${
            !tabs.rooms ? "hidden" : ""
          }`}
          data-testid={`user:${user.username}:tab:rooms`}
          onClick={() => setActiveTab("rooms")}
        >
          {t("pages.viewUser.profileTabs.rooms")}
        </button>
        <button
          className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "scheduled" && `border-accent text-accent`} ${
            !tabs.scheduled ? "hidden" : ""
          }`}
          onClick={() => setActiveTab("scheduled")}
          data-testid={`user:${user.username}:tab:scheduled`}
        >
          {t("pages.viewUser.profileTabs.scheduled")}
        </button>
        <button
          className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "recorded" && `border-accent text-accent`} ${
            !tabs.recorded ? "hidden" : ""
          }`}
          onClick={() => setActiveTab("recorded")}
          data-testid={`user:${user.username}:tab:recorded`}
        >
          {t("pages.viewUser.profileTabs.recorded")}
        </button>
        <button
          className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "clips" && `border-accent text-accent`} ${
            !tabs.clips ? "hidden" : ""
          }`}
          onClick={() => setActiveTab("clips")}
          data-testid={`user:${user.username}:tab:clips`}
        >
          {t("pages.viewUser.profileTabs.clips")}
        </button>

        <button
          className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "admin" && `border-accent text-accent`} ${
            conn.user.staff && conn.user.id !== user.id ? "" : "hidden"
          }`}
          onClick={() => setActiveTab("admin")}
          data-testid={`user:${user.username}:tab:admin`}
        >
          {t("pages.viewUser.profileTabs.admin")}
        </button>
      </div>

      <div>
        <ProfileAbout
          className={activeTab !== "about" ? "hidden" : ""}
          username={user.username}
          followers={user.numFollowers}
          following={user.numFollowing}
          description={user.bio}
          tags={aboutTags}
        />

        <ProfileScheduled
          user={user}
          className={activeTab !== "scheduled" ? "hidden" : ""}
        />
        <ProfileAdmin
          className={activeTab !== "admin" ? "hidden" : ""}
          user={user}
        />
      </div>
    </>
  );
};

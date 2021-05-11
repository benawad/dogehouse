import { UserWithFollowInfo } from "@dogehouse/kebab";
import React, { useState } from "react";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { ProfileAbout } from "./ProfileAbout";
import { ProfileScheduled } from "./ProfileScheduled";

export interface ProfileTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserWithFollowInfo;
  tabs?: {
    about?: boolean;
    rooms?: boolean;
    scheduled?: boolean;
    recorded?: boolean;
    clips?: boolean;
  };
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
  ...props
}) => {
  const [activeTab, setActiveTab] = useState("about");
  const { t } = useTypeSafeTranslation();
  return (
    <>
      <div
        className={`w-full flex items-center justify-around ${className}`}
        {...props}
      >
        {tabs.about ? (
          <button
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "about" && `border-accent text-accent`}`}
            onClick={() => setActiveTab("about")}
          >
            {t("pages.viewUser.profileTabs.about")}
          </button>
        ) : null}
        {tabs.rooms ? (
          <button
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "rooms" && `border-accent text-accent`}`}
            onClick={() => setActiveTab("rooms")}
          >
            {t("pages.viewUser.profileTabs.rooms")}
          </button>
        ) : null}
        {tabs.scheduled ? (
          <button
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "scheduled" && `border-accent text-accent`}`}
            onClick={() => setActiveTab("scheduled")}
          >
            {t("pages.viewUser.profileTabs.scheduled")}
          </button>
        ) : null}
        {tabs.recorded ? (
          <button
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "recorded" && `border-accent text-accent`}`}
            onClick={() => setActiveTab("recorded")}
          >
            {t("pages.viewUser.profileTabs.recorded")}
          </button>
        ) : null}
        {tabs.clips ? (
          <button
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 transition hover:border-accent focus:outline-no-chrome
               ${activeTab === "clips" && `border-accent text-accent`}`}
            onClick={() => setActiveTab("clips")}
          >
            {t("pages.viewUser.profileTabs.clips")}
          </button>
        ) : null}
      </div>

      <div>
        <ProfileAbout
          className={activeTab !== "about" ? "hidden" : ""}
          username={user.username}
          followers={user.numFollowers}
          following={user.numFollowing}
          description={user.bio}
          tags={[]}
        />

        <ProfileScheduled
          user={user}
          className={activeTab !== "scheduled" ? "hidden" : ""}
        />
      </div>
    </>
  );
};

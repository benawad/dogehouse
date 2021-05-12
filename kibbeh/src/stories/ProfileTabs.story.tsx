import { UserWithFollowInfo } from "@dogehouse/kebab";
import { Story } from "@storybook/react";
import { ProfileTabs, ProfileTabsProps } from "../ui/ProfileTabs";

export default {
  title: "ProfileTabs",
  component: ProfileTabs,
};

const user: UserWithFollowInfo = {
  username: "Amitoj",
  online: true,
  lastOnline: "",
  id: "awdawd69",
  bio: "",
  displayName: "Amitoj",
  avatarUrl: "",
  bannerUrl: "",
  numFollowers: 696969,
  numFollowing: 0,
  staff: true,
  contributions: 100,
};

export const ScheduledTabActive: Story<ProfileTabsProps> = ({}) => {
  return (
    <div className="space-y-4 space-x-2">
      <ProfileTabs user={user} />
    </div>
  );
};

ScheduledTabActive.bind({});

export const RoomsTabActive: Story<ProfileTabsProps> = ({}) => {
  return (
    <div className="space-y-4 space-x-2">
      <ProfileTabs user={user} />
    </div>
  );
};

RoomsTabActive.bind({});

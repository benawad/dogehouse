import { Story } from "@storybook/react";
import { ProfileTabs, ProfileTabsProps } from "../ui/ProfileTabs";

export default {
  title: "ProfileTabs",
  component: ProfileTabs,
};

export const ScheduledTabActive: Story<ProfileTabsProps> = ({
  activeTab = "scheduled",
}) => {
  return (
    <div className="space-y-4 space-x-2">
      <ProfileTabs activeTab={activeTab} />
    </div>
  );
};

ScheduledTabActive.bind({});

export const RoomsTabActive: Story<ProfileTabsProps> = ({
  activeTab = "rooms",
}) => {
  return (
    <div className="space-y-4 space-x-2">
      <ProfileTabs activeTab={activeTab} />
    </div>
  );
};

RoomsTabActive.bind({});

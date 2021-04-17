import React from "react";
import { Story } from "@storybook/react";
import { ProfileAbout, ProfileAboutProps } from "../ui/ProfileAbout";

export default {
  title: "ProfileAbout",
  component: ProfileAbout,
};

export const Main: Story<ProfileAboutProps> = (props) => {
  return (
    <ProfileAbout
      username="glenn_brenner"
      followers={15215}
      following={672}
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis nunc sit pulvinar ut tellus sit tincidunt faucibus sapien. ⚡️"
      link="https://example.com"
      tags={[
        {
          icon: "logo",
          children: "Member since 13 March 2021",
        },
        {
          icon: "dogeNitro",
          children: "DogeNitro User",
        },
        {
          icon: "dogeStaff",
          children: "DogeHouse Staff",
        },
        {
          icon: "dogeContributor",
          children: "DogeHouse Contributor",
        },
      ]}
    />
  );
};

Main.bind({});

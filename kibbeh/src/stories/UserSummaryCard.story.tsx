import React from "react";
import { Story } from "@storybook/react";
import avatar from "../img/avatar.png";
import { UserSummaryCard, UserSummaryCardProps } from "../ui/UserSummaryCard";
import { SolidDogenitro } from "../icons";

export default {
  title: "UserSummaryCard",
  component: UserSummaryCard,
};

const userSummary: UserSummaryCardProps = {
  avatar,
  userId: "1",
  displayName: "Arnau Jiménez",
  username: "@ajmnz",
  following: 89,
  followers: 3400,
  bio:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis nunc sit pulvinar ut tellus sit tincidunt faucibus sapien. ⚡️",
  website: "https://loremipsum.com",
  isOnline: true,
  badges: [
    { content: "ƉC", variant: "primary" },
    { content: "ƉS", variant: "primary" },
    {
      content: <SolidDogenitro width={12} style={{ color: "#fff" }} />,
      variant: "secondary",
    },
  ],
};

export const Main: Story<UserSummaryCardProps> = ({ ...props }) => (
  <UserSummaryCard {...props} {...userSummary} />
);

Main.bind({});

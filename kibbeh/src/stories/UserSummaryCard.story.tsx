import React from "react";
import { Story } from "@storybook/react";
import avatar from "../img/avatar.png";
import { UserSummaryCard, UserSummaryCardProps } from "../ui/UserSummaryCard";
import { SmSolidDogenitro } from "../icons";

export default {
  title: "UserSummaryCard",
  component: UserSummaryCard,
};

const SVG = (): JSX.Element => <SmSolidDogenitro width={12} style={{ color: '#FFF' }} />;

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
    { content: "ƉC", variant: "primary", type: "text" },
    { content: "ƉS", variant: "primary", type: "text" },
    { content: SVG, variant: "secondary", type: "svg" },
  ],
};

export const Main: Story<UserSummaryCardProps> = ({ ...props }) => (
  <UserSummaryCard {...props} {...userSummary} />
);

Main.bind({});

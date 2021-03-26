// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck @todo this file needs to be fixed

import Header, { HeaderProps } from "../ui/Header";
import { Story } from "@storybook/react";
import { SolidDogenitro } from "../icons";

import avatarPlaceholderImg from "../img/avatar.png";
import { Button } from "../ui/Button";

export default {
  title: "Header",
  component: Header,
};

export const Main: Story<HeaderProps> = ({
  searchPlaceholder = "Search for rooms, users or categories",
  onSearchChange = () => null,
  onAnnouncementsClick = () => null,
  onMessagesClick = () => null,
  onNotificationsClick = () => null,
  avatarImg = avatarPlaceholderImg,
}) => (
  <Header
    searchPlaceholder={searchPlaceholder}
    onSearchChange={onSearchChange}
    onAnnouncementsClick={onAnnouncementsClick}
    onMessagesClick={onMessagesClick}
    onNotificationsClick={onNotificationsClick}
    actionButton={
      <Button size="small" icon={<SolidDogenitro />}>
        Get Coins
      </Button>
    }
    avatarImg={avatarImg}
  />
);

import Header, { HeaderProps } from "../ui/Header";
import { Story } from "@storybook/react";
import { SolidDogenitro } from "../icons";

import avatarPlaceholderImg from "../img/avatar.png";

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
  actionButtonIcon = <SolidDogenitro />,
  actionButtonLabel = "Get Coins",
  onActionButtonClick = () => null,
  avatarImg = avatarPlaceholderImg,
}) => (
  <Header
    searchPlaceholder={searchPlaceholder}
    onSearchChange={onSearchChange}
    onAnnouncementsClick={onAnnouncementsClick}
    onMessagesClick={onMessagesClick}
    onNotificationsClick={onNotificationsClick}
    actionButtonIcon={actionButtonIcon}
    actionButtonLabel={actionButtonLabel}
    onActionButtonClick={onActionButtonClick}
    avatarImg={avatarImg}
  />
);

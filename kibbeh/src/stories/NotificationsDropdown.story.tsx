import React, { ReactElement, ReactNode } from "react";
import { BaseOverlay } from "../ui/BaseOverlay";
import {
  FollowNotification,
  GenericNotification,
  LiveNotification,
  NewRoomNotification,
} from "../ui/NotificationElement";
import avatar from "../img/avatar.png";
import { Story } from "@storybook/react";
import {
  NotificationsDropdown,
  NotificationsDropdownProps,
  NotificationsDropdownPropsData,
} from "../ui/NotificationsDropdown";

export default {
  title: "NotificationsDropdown",
};

const Notifications: NotificationsDropdownProps = {
  data: [
    {
      type: "follow",
      time: "right now",
      username: "John Doe",
      userAvatarSrc: "https://picsum.photos/250/250",
    },
    {
      type: "generic",
      notificationMsg: "Lorem Ipsum",
      time: "right now",
    },
    {
      type: "live",
      username: "John Doe",
      time: "10 minutes ago",
    },
    {
      type: "newroom",
      username: "Have fun at dogehouse!",
      time: "2 minutes ago",
    },
  ],
};

export const Main: Story<NotificationsDropdownProps> = ({...props}) => {
  return (
    <NotificationsDropdown {...props} {...Notifications} />
  );
};

Main.bind({});

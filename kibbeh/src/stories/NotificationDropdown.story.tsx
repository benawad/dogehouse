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
import { NotificationsDropdown } from "../ui/NotificationsDropdown";

export default  {
  title: "NotificationsDropdown"
}

interface IconWrapperProps {
  children: ReactNode;
}

function IconWrapper({ children }: IconWrapperProps) {
  return <div className="py-3 px-4">{children}</div>;
}

const NotificationDropdown: Story = () => {
  return (
    <div style={{ width: 444 }}>
      <BaseOverlay title={"Notifications"}>
        <IconWrapper>
          <GenericNotification
            notificationMsg="you have a new notification"
            time="some time ago"
          />
        </IconWrapper>
        <IconWrapper>
          <LiveNotification username="johndoe" time="some time ago" />
        </IconWrapper>
        <IconWrapper>
          <NewRoomNotification username={"johndoe"} time="some time ago" />
        </IconWrapper>
        <IconWrapper>
          <FollowNotification
            userAvatarSrc={avatar}
            username="johndoe"
            time="some time ago"
          />
        </IconWrapper>
      </BaseOverlay>
    </div>
  );
};

export const Main = NotificationsDropdown.bind({});

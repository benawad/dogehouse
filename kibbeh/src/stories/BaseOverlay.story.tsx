import React, { ReactNode } from "react";
import { Story } from "@storybook/react";

import { BaseOverlay, BaseOverlayProps } from "../ui/BaseOverlay";
import { MessageElement } from "../ui/MessageElement";
import avatar from "../img/avatar.png";
import {
  FollowNotification,
  GenericNotification,
  LiveNotification,
  NewRoomNotification,
} from "../ui/NotificationElement";
import { SettingsIcon } from "../ui/SettingsIcon";
import { SmSolidCaretRight, SmOutlineGlobe, SmSolidUser } from "../icons";

const user = {
  avatar,
  username: "TerryOwen",
  isOnline: true,
};

const msg = {
  text:
    "Hey! I really liked your room, but would like to contribute to dogehouse",
  ts: 1615116474,
};

export default {
  title: "BaseOverlay",
  component: BaseOverlay,
};

export const Messages: Story<BaseOverlayProps> = ({
  title = "Messages",
  actionButton: actionLabel = "Show More",
}) => (
  <div style={{ width: 444 }}>
    <BaseOverlay title={title} actionButton={actionLabel}>
      <MessageElement user={user} msg={msg} />
      <MessageElement user={user} msg={msg} />
      <MessageElement user={user} msg={msg} />
    </BaseOverlay>
  </div>
);

Messages.bind({});

interface IconWrapperProps {
  children: ReactNode;
}
function IconWrapper({ children }: IconWrapperProps) {
  return <div className="py-3 px-4">{children}</div>;
}

export const Notifications: Story<BaseOverlayProps> = ({
  title = "Notifications",
}) => (
  <div style={{ width: 444 }}>
    <BaseOverlay title={title}>
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

Notifications.bind({});

export const Settings: Story<BaseOverlayProps> = ({
  actionButton: actionLabel = "Log out",
}) => (
  <div style={{ width: 200 }}>
    <BaseOverlay actionButton={actionLabel}>
      <div className="flex flex-col">
        <SettingsIcon
          icon={<SmSolidUser className={`text-primary-100`} />}
          label={"profile"}
        />
        <SettingsIcon
          icon={<SmOutlineGlobe />}
          label={"Language"}
          trailingIcon={<SmSolidCaretRight />}
        />
      </div>
    </BaseOverlay>
  </div>
);

Settings.bind({});

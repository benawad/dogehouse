import React, { PropsWithChildren, ReactElement } from "react";
import { BaseOverlay } from "./BaseOverlay";
import { FollowNotification, GenericNotification, LiveNotification, NewRoomNotification } from "./NotificationElement";

export interface NotificationsDropdownPropsData {
  type: string,
  time: string,
  username?: string,
  notificationMsg?: string,
  userAvatarSrc?: string,
}

export interface NotificationsDropdownProps {
  data: NotificationsDropdownPropsData[]
}

const parseNotification = (props: NotificationsDropdownPropsData) => {
  switch (props.type.toLowerCase()) {
  case "follow": {
    return <FollowNotification userAvatarSrc={props.userAvatarSrc!} username={props.username!} time={props.time!} />;
    break;
  }
  case "generic": {
    return <GenericNotification notificationMsg={props.notificationMsg} time={props.time} />;
    break;
  }
  case "live": {
    return <LiveNotification username={props.username!} time={props.time} />;
    break;
  }
  case "newroom": {
    return <NewRoomNotification username={props.username!} time={props.time} />;
    break;
  }
  }
};


export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = (props) => {
  return (
    <div style={{ width: 444 }}>
      <BaseOverlay title={"Notifications"}>
        {
          props.data.map((p, i) => (
            <div className={"py-3 px-4"} key={i}>
              {parseNotification(p)}
            </div>
          ))
        }
      </BaseOverlay>
    </div>
  );
};

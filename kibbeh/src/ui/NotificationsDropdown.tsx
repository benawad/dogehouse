import React, { ReactElement } from "react";
import { BaseOverlay } from "./BaseOverlay";
import { FollowNotification, GenericNotification, LiveNotification, NewRoomNotification } from "./NotificationElement";

export interface NotificationsDropdownProps {
  type: string,
  time: string,
  username?: string,
  notificationMsg?: string,
  userAvatarSrc?: string,
}

const parseNotification = (props: NotificationsDropdownProps) => {
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

export const NotificationsDropdown: React.FC<NotificationsDropdownProps[]> = (data) => {
  return (
    <div style={{ width: 444 }}>
      <BaseOverlay title={"Notifications"}>
        {
          data.map((props) => (
            <div className={"py-3 px-4"}>
              {parseNotification(props)}
            </div>
          ))
        }
      </BaseOverlay>
    </div>
  );
};

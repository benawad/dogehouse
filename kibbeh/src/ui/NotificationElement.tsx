import React, { ReactNode } from "react";
import SvgSmSolidNotifications from "../icons/SmSolidNotifications";

export interface NotificationElementProps {
  notificationMsg: String;
  time: String;
  actionButton: ReactNode;
  icon?: ReactNode;
}

export const NotificationElement: React.FC<NotificationElementProps> = ({
  notificationMsg,
  time,
  actionButton,
  icon,
}) => {
  return (
    <div className="flex items-center" style={{ width: "400px" }}>
      <div className="mr-3">{icon ? icon : <SvgSmSolidNotifications />}</div>
      <div className="flex flex-col">
        <div className="text-primary-100">
          {notificationMsg ? notificationMsg : "you have a new notification"}
        </div>
        <div className="text-primary-300 text-sm">
          {time ? time : "some time ago"}
        </div>
      </div>
      <div className="ml-auto">{actionButton}</div>
    </div>
  );
};

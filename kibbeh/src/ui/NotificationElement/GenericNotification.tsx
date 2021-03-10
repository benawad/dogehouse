import React, { ReactNode } from "react";
import { LgSolidRocket } from "../../icons";

export interface GenericNotificationProps {
  notificationMsg: ReactNode;
  time: string;
  actionButton?: ReactNode;
  icon?: ReactNode;
}

export const GenericNotification: React.FC<GenericNotificationProps> = ({
  notificationMsg,
  time,
  actionButton,
  icon,
}) => {
  return (
    <div className="flex items-center" style={{ width: "400px" }}>
      <div className="mr-3" style={{ height: "39px", width: "39px" }}>
        {icon ? icon : <LgSolidRocket />}
      </div>
      <div className="flex flex-col">
        <div className="text-primary-100 flex-wrap">
          {notificationMsg ? notificationMsg : "you have a new notification"}
        </div>
        <div className="text-primary-300 text-sm">
          {time ? time : "some time ago"}
        </div>
      </div>
      {actionButton ? <div className="ml-auto">{actionButton}</div> : null}
    </div>
  );
};

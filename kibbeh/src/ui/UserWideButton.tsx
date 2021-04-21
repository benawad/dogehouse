import { format, isToday, isPast, differenceInMilliseconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { SolidTime } from "../icons";
import { BubbleText } from "./BubbleText";
import { RoomCardHeading } from "./RoomCardHeading";
import { Tag } from "./Tag";
import { SingleUser } from './UserAvatar';
import { Button } from './Button';
import { HeaderController } from '../modules/display/HeaderController';
import { useTypeSafeTranslation } from '../shared-hooks/useTypeSafeTranslation';
import { BaseUser } from '@dogehouse/kebab';

interface VerticalUserInfoProps {
    user: BaseUser;

}

export const UserWideButton: React.FC<VerticalUserInfoProps> = ({ user }) => {
    const { t } = useTypeSafeTranslation();
    return (
      <>
      
        {/* <HeaderController
          embed={{}}
          title={`${user.displayName} (@${user.username})`}
        /> */}
        <div className="flex flex-row rounded-8 pt-5 px-6 pb-7 w-full items-left">
          <SingleUser
            size="md"
            src={user.avatarUrl}
            username={user.username}
          />
          <div className="flex flex-col mt-2 px-2 max-w-full">
            <span className="flex text-primary-100 font-bold h-full break-all line-clamp-1 truncate">
              {user.displayName}
            </span>
            <span className="flex text-primary-300 ml-1">@{user.username}</span>
            {/* <Badges badges={badges} /> */}
          </div>
          <span className="flex text-primary-300 ml-1 items-end">
          <Button size="big" color="primary" >
            follow
        </Button>
        </span>
        </div>
        </>
    );
  };
  
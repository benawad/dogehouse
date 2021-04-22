import { format, isToday, isPast, differenceInMilliseconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { SingleUser } from './UserAvatar';
import { Button } from './Button';
import { HeaderController } from '../modules/display/HeaderController';
import { useTypeSafeTranslation } from '../shared-hooks/useTypeSafeTranslation';
import { BaseUser } from '@dogehouse/kebab';

interface VerticalUserInfoProps {
    user: BaseUser;

}

const divStyle = {
    width: '719px',
    height: '143px',
    left: '55px',
    top: '91px',
    background: '#151A21'

};

const avatarStyle = {
    width: '44px',
height: '44px',
left: '-2px',
top: '-3px',
marginLeft:'57px',
// marginRight:'618px',
marginBottom:'53px',
marginTop: '46px'

}
const newStyle = {
    // position: 'static',
width: '90px',
height: '22px',
marginTop: '60px',
marginRight: '59px',
marginLeft: '250px',
marginBottom: '61px'
};

const testStyle = {
    width: '81px',
    height: '22px',
    left: '70px',
    top: '0px',
    color: '#DEE3EA'
}


export const UserWideButton: React.FC<VerticalUserInfoProps> = ({ user }) => {
    const { t } = useTypeSafeTranslation();
    
    const deleteHandler  = (e: { type: string; }) => {
        alert("blocked");
    };
    
    return (
      <>
      
        {/* <HeaderController
          embed={{}}
          title={`${user.displayName} (@${user.username})`}
        /> */}
        <div style={divStyle} className="flex flex-row rounded-8  items-center " >
        <span style={avatarStyle} >
          <SingleUser
            size="md"
            src={user.avatarUrl}
            username={user.username}
          />
          </span>
          <div className="flex flex-col mt-3 px-3 max-w-full ">
            <span className="flex text-primary-100 mr-1 font-bold h-full break-all line-clamp-1 truncate" style={testStyle}>
              {user.displayName}
            </span>
            <span style={{color: "#5D7290"}} className="flex text-primary-300 mr-1">@{user.username}</span>
            {/* <Badges badges={badges} /> */}
          </div>
          <span style={newStyle} >
          <Button size="big" color="primary" onClick={deleteHandler}>
            unblock
        </Button>
        </span>
        </div>
        </>
    );
  };
  
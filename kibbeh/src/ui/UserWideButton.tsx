import React, { useState } from "react";
import { SingleUser } from "./UserAvatar";
import { Button } from "./Button";
import { BaseUser } from "@dogehouse/kebab";

export interface UserWideButtonInfoProps {
  user: BaseUser;
}

const divStyle = {
  width: "719px",
  height: "143px",
  background: "#151A21",
};

const avatarStyle = {
  width: "44px",
  height: "44px",
  left: "-2px",
  top: "-3px",
  marginLeft: "57px",
  marginBottom: "53px",
  marginTop: "46px",
};

const buttonStyle = {
  width: "90px",
  height: "22px",
  marginTop: "60px",
  marginRight: "79px",
  left: "531px",
  top: "11px",
  marginLeft: "350px",
  marginBottom: "61px",
};

const displayStyle = {
  height: "22px",
  left: "70px",
  fontSize: "14px",
  lineHeight: "22px",
  top: "0px",
  color: "#DEE3EA",
};

const nameStyle = {
  height: "22px",
  left: "70px",
  top: "22px",
  fontSize: "12px",
  lineHeight: "22px",
  color: "#5D7290",
};

export const UserWideButton: React.FC<UserWideButtonInfoProps> = ({ user }) => {
  const [buttonText, setButtonText] = useState("Unblock");

  const changeText = (text: React.SetStateAction<string>) => {
    console.log({ user });
    if (buttonText == "Unblock") {
      setButtonText(text);
    } else {
      setButtonText("Unblock");
    }
  };

  return (
    <>
      <div style={divStyle} className="flex flex-row items-center mr-3.688">
        <div style={avatarStyle} className="flex">
          <SingleUser size="av" src={user.avatarUrl} username={user.username} />
        </div>
        <div className="flex flex-col ml-1.5">
          <span
            className="flex font-bold h-full break-all line-clamp-1 truncate"
            style={displayStyle}
          >
            {user.displayName}
          </span>
          <span style={nameStyle} className="flex">
            @{user.username}
          </span>
        </div>
        <div style={buttonStyle} className="flex flex-col">
          <Button
            size="small"
            color="primary"
            onClick={() => changeText("Block")}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </>
  );
};

import React, { useState, useRef, ChangeEventHandler } from "react";

import { Button } from "./Button";
import { SolidTrash } from "../icons";
import { SingleUser } from './UserAvatar';
import { BaseUser } from '@dogehouse/kebab';
import { BaseSettingsItem } from './BaseSettingsItem';

export interface ChangeAvatarCardProps {
  user: BaseUser;
}

export const ChangeAvatarCard: React.FC<ChangeAvatarCardProps> = ({
  user,
}) => {
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteHandler = () => {
    console.log("profile picture deleted");
  };

  const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files!.length < 1) return;
    const file = e.target.files![0];
    if (file.size > 3145728) {
      alert("File size must be less than 3MB");
      return;
    }
    const type = file.type.toLocaleLowerCase();
    if (type.includes("jpg") || type.includes("jpeg") || type.includes("png")) {
      setAvatar(URL.createObjectURL(file));
      // upload the new banner
    }
  };

  const changeProfileButtonClickHandler = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <BaseSettingsItem className="flex items-center px-2 py-2 w-full">
    <div className="flex">
      <SingleUser src={avatar} username={user.username} />
      <div className="flex flex-col p-3">
        <div className="flex">
          <Button
            size="small"
            color="secondary"
            onClick={changeProfileButtonClickHandler}
          >
            Change profile picture
          </Button>
          <Button
            className="ml-2"
            color="secondary"
            size="small"
            style={{minHeight: "28px"}}
            onClick={deleteHandler}
          >
            <SolidTrash />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={fileChangeHandler}
            className="w-0 h-0 invisible"
            accept="image/jpeg, image/jpg, image/png"
          />
        </div>
        <div className="flex mt-2">
        <span className="text-primary-300 font-medium text-sm">
          Only JPG or PNG and maximum 3MB.
        </span>
        </div>
      </div>
    </div>
    </BaseSettingsItem>
  );
};
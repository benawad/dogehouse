import React, { useState, useRef, ChangeEventHandler } from "react";

import { Button } from "./Button";
import SolidTrashIcon from "../icons/SolidTrash";
import { SingleUser } from "./UserAvatar";
import { BaseUser } from "@dogehouse/kebab";
import { BaseSettingsItem } from "./BaseSettingsItem";

export interface ChangeAvatarCardProps {
  user: BaseUser;
}

export const ChangeAvatarCard: React.FC<ChangeAvatarCardProps> = ({ user }) => {
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: set picture to no image/some default
  const deleteHandler = () => {
    alert("profile picture deleted");
  };

  const fileUploadHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const MAX_FILE_SIZE = 3145728;
    // get file
    const file = (e.target.files as FileList)[0];
    console.log(file);

    if (file.size < 1) {
      console.log("Empty file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 3MB");
      return;
    }

    // TODO: add upload to image store/github/twitter
    const type = file.type.toLocaleLowerCase();
    if (type.includes("jpg") || type.includes("jpeg") || type.includes("png")) {
      // upload the new url
      setAvatar(URL.createObjectURL(file));
    }
  };

  const uploadProfilePictureHandler = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <BaseSettingsItem className="flex items-center px-4 py-3">
      <div>
        <SingleUser src={avatar} username={user.username} />
      </div>
      <div className="flex flex-col p-3">
        <div className="flex">
          <Button
            size="small"
            color="secondary"
            onClick={uploadProfilePictureHandler}
          >
            <label htmlFor="avatar" className="relative cursor-pointer">
              Change profile picture
              <input
                onChange={fileUploadHandler}
                type="file"
                name="avatar"
                id="avatar"
                accept="image/png,image/jpg, image/jpeg"
                className="hidden"
              />
            </label>
          </Button>
          <Button
            className="ml-2"
            color="secondary"
            size="small"
            style={{ minHeight: "28px" }}
            onClick={deleteHandler}
          >
            <SolidTrashIcon className="text-primary-100" />
          </Button>
        </div>
        <div className="flex mt-2">
          <span className="text-primary-300 font-medium text-sm">
            Only JPG or PNG and maximum 3MB.
          </span>
        </div>
      </div>
    </BaseSettingsItem>
  );
};

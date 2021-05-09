import React, { useState } from "react";
import { BaseSettingsItem } from "./BaseSettingsItem";
import { SingleUser } from "./UserAvatar";
import { Button } from "./Button";
import SolidTrashIcon from "../icons/SolidTrash";

export interface ChangeAvatarCardProps {
  avatarUrl: string;
}

export const ChangeAvatarCard: React.FC<ChangeAvatarCardProps> = ({
  avatarUrl,
}) => {
  const [baseAvatarUrl, setAvatarUrl] = useState(avatarUrl);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 3145728;
    const file = (e.target.files as FileList)[0];

    if (file.size > MAX_FILE_SIZE) return; // show error toast

    if (file.size < 1) return;

    // add upload to image store/github/twitter
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleImageDelete = () => {
    // handle delete and change image to default and setAvatarUrl to default avatar
    setAvatarUrl("");
  };

  return (
    <BaseSettingsItem className="flex items-center px-4 py-3">
      <div>
        <SingleUser src={baseAvatarUrl} />
      </div>
      <div className="flex flex-col ml-5">
        <div className="flex items-center">
          <Button size="small" color="secondary" className="">
            <label
              htmlFor="avatar"
              className="relative cursor-pointer text-primary-100"
            >
              Change profile picture
              <input
                onChange={handleImageUpload}
                type="file"
                name="avatar"
                id="avatar"
                accept="image/png, image/jpeg"
                className="hidden"
              />
            </label>
          </Button>
          <Button
            size="small"
            color="secondary"
            className="ml-2"
            style={{ minHeight: "28px" }}
            onClick={handleImageDelete}
          >
            <SolidTrashIcon className="text-primary-100" />
          </Button>
        </div>
        <div className="mt-2">
          <div className="text-primary-300 text-sm">
            Only JPG or PNG and maximum 3MB.
          </div>
        </div>
      </div>
    </BaseSettingsItem>
  );
};

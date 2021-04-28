import React, { useState, useRef, ChangeEventHandler } from "react";

import { Button } from "./Button";
import { SolidTrash } from "../icons";

export interface ChangeBannerCardProps {
  bannerUrl: string;
}

export const ChangeBannerCard: React.FC<ChangeBannerCardProps> = ({
  bannerUrl,
}) => {
  const [banner, setBanner] = useState(bannerUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteHandler = () => {
    console.log("banner deleted");
  };

  const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files!.length < 1) return;
    const file = e.target.files![0];
    if (file.size > 5000000) {
      console.log("File size must be less than 5MB");
      return;
    }
    const type = file.type.toLocaleLowerCase();
    if (type.includes("jpg") || type.includes("jpeg") || type.includes("png")) {
      setBanner(URL.createObjectURL(file));
      // upload the new banner
    }
  };

  const changeProfileButtonClickHandler = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <div className="rounded-8 flex flex-col bg-primary-900">
      <img
        src={banner}
        alt="banner"
        style={{ maxHeight: "145px" }}
        className="w-full h-full rounded-t-8 object-cover"
      />
      <div className="flex justify-between items-center p-4">
        <div className="flex">
          <Button
            size="small"
            color="primary-300"
            onClick={changeProfileButtonClickHandler}
          >
            Change profile header
          </Button>
          <Button
            className="ml-2"
            color="primary-300"
            size="small"
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
        <span className="text-primary-300 font-medium text-sm">
          Only JPG or PNG and maximum 5MB.
        </span>
      </div>
    </div>
  );
};

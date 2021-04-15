import React, { useEffect, useState } from "react";
import { SolidDogenitro } from "../icons";
import Logo from "../icons/LogoIcon";

export interface UserBadgeLgProps extends React.HTMLProps<HTMLDivElement> {
  icon: "logo" | "dogeNitro" | "dogeStaff" | "dogeContributor";
}

// @todo the tag doesn't really glow like in figma right now
export const UserBadgeLg: React.FC<UserBadgeLgProps> = ({ icon, children }) => {
  const [parsedIcon, setParsedIcon] = useState(null as React.ReactNode);
  useEffect(() => {
    switch (icon) {
      case "logo":
        setParsedIcon(
          <Logo
            fillCurrent={true}
            className="relative transform translate-x-n1/2 translate-y-n1/2 top-1/2 left-1/2"
          />
        );
        break;
      case "dogeNitro":
        setParsedIcon(
          <SolidDogenitro className="relative transform translate-x-n1/2 translate-y-n1/2 top-1/2 left-1/2" />
        );
        break;
      case "dogeStaff":
        setParsedIcon(<span className="font-bold block text-center h-full w-full">ƉS</span>);
        break;
      case "dogeContributor":
        setParsedIcon(<span className="font-bold block text-center h-full w-full">ƉC</span>);
        break;
    }
  }, [setParsedIcon, icon]);

  return (
    <p className="flex text-primary-300">
      {parsedIcon ? (
        <span style={{ width: "2em" }} className="w-5 mr-1">
          {parsedIcon}
        </span>
      ) : (
        ""
      )}
      <span className="">{children}</span>
    </p>
  );
};

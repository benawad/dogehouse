import React, { useEffect, useState } from "react";
import {
  SolidContributor,
  SolidDogenitro,
  SolidStaff,
  LogoIcon,
} from "../icons";
import { ContributorBadge, StaffBadge } from "../icons/badges";

export interface UserBadgeLgProps extends React.HTMLProps<HTMLDivElement> {
  icon: "logo" | "dogeNitro" | "dogeStaff" | "dogeContributor";
  contributions?: number;
}

export const UserBadgeLg: React.FC<UserBadgeLgProps> = ({
  icon,
  children,
  contributions,
}) => {
  const [parsedIcon, setParsedIcon] = useState(null as React.ReactNode);
  useEffect(() => {
    switch (icon) {
      case "logo":
        setParsedIcon(
          <LogoIcon
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
        setParsedIcon(
          <StaffBadge
            style={{ color: "var(--color-primary-300)" }}
            className="relative transform translate-x-n1/2 translate-y-n1/2 top-1/2 left-1/2"
          />
        );
        break;
      case "dogeContributor":
        setParsedIcon(
          <ContributorBadge
            contributions={contributions!}
            style={{ color: "var(--color-primary-300)" }}
            className="relative transform translate-x-n1/2 translate-y-n1/2 top-1/2 left-1/2"
          />
        );
        break;
    }
  }, [setParsedIcon, icon, contributions]);

  return (
    <div className="flex text-primary-300">
      {parsedIcon ? (
        <span style={{ width: 16 }} className="mr-2">
          {parsedIcon}
        </span>
      ) : (
        ""
      )}
      <span>
        {children}
        {contributions ? ` (${contributions})` : ""}
      </span>
    </div>
  );
};

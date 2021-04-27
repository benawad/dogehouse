import Link from "next/link";
import React from "react";
import { LgLogo, LogoIcon } from "../../icons";
import { useScreenType } from "../../shared-hooks/useScreenType";

export interface LeftHeaderProps {}

const LeftHeader: React.FC<LeftHeaderProps> = ({}) => {
  const screenType = useScreenType();
  return (
    <Link href="/dash">
      <a data-testid="logo-link" className="w-full">
        {screenType === "3-cols" ? (
          <LgLogo />
        ) : (
          <div className="flex justify-center w-full">
            <LogoIcon width={40} height={40} color="#EFE7DC" />
          </div>
        )}
      </a>
    </Link>
  );
};

export default LeftHeader;

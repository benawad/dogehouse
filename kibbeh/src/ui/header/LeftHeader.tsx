import Link from "next/link";
import React from "react";
import { LgLogo } from "../../icons";

export interface LeftHeaderProps {}

const LeftHeader: React.FC<LeftHeaderProps> = ({}) => {
  return (
    <Link href="/dash">
      <a>
        <LgLogo />
      </a>
    </Link>
  );
};

export default LeftHeader;

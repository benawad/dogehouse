import Link from "next/link";
import React from "react";
import { LgLogo } from "../../icons";

interface LeftHeaderProps {}

export const LeftHeader: React.FC<LeftHeaderProps> = ({}) => {
  return (
    <Link href="/dashboard">
      <a>
        <LgLogo />
      </a>
    </Link>
  );
};

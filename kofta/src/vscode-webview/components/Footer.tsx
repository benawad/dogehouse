import React from "react";
import { tw } from "twind";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <div className={tw`justify-around flex`}>
      <a
        href="https://github.com/benawad/dogehouse#investors"
        style={{ color: "var(--vscode-textLink-foreground)" }}
      >
        Investors
      </a>
      <a
        style={{ color: "var(--vscode-textLink-foreground)" }}
        href="https://github.com/benawad/dogehouse/issues"
      >
        Report a Bug
      </a>
    </div>
  );
};

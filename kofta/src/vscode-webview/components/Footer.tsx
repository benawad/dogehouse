import React from "react";
import { tw } from "twind";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <div className={tw`justify-around flex`}>
      <a href="" style={{ color: "var(--vscode-textLink-foreground)" }}>
        investors
      </a>
      <a
        style={{ color: "var(--vscode-textLink-foreground)" }}
        href="https://github.com/benawad/dogehouse/issues"
      >
        report a bug
      </a>
    </div>
  );
};

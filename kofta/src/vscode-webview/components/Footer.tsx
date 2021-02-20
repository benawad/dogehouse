import React from "react";
import { tw } from "twind";
import { Link as RouterLink } from "react-router-dom";

interface FooterProps {
  isLogin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isLogin }) => {
  return (
    <div className={tw`justify-around flex`}>
      <a
        href="https://github.com/benawad/dogehouse#investors"
        style={{ color: "var(--vscode-textLink-foreground)" }}
      >
        Investors
      </a>
      {isLogin ? (
        <a
          href="https://www.youtube.com/watch?v=hy-EhJ_tTQo"
          style={{ color: "var(--vscode-textLink-foreground)" }}
        >
          Origin Story
        </a>
      ) : null}
      <a
        href="https://discord.gg/wCbKBZF9cV"
        style={{ color: "var(--vscode-textLink-foreground)" }}
      >
        Discord
      </a>
      <a
        style={{ color: "var(--vscode-textLink-foreground)" }}
        href="https://github.com/benawad/dogehouse/issues"
      >
        Report a Bug
      </a>
      <RouterLink
        style={{ color: "var(--vscode-textLink-foreground)" }}
        to="/change-log"
      >
        What's new?
      </RouterLink>
    </div>
  );
};

import React from "react";
import { RegularAnchor } from "./RegularAnchor";

interface FooterProps {
  isLogin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isLogin }) => {
  return (
    <div className={`justify-around flex text-center`}>
      {isLogin ? (
        <RegularAnchor href="https://www.youtube.com/watch?v=hy-EhJ_tTQo">
          Origin Story
        </RegularAnchor>
      ) : null}
      <RegularAnchor href="https://discord.gg/wCbKBZF9cV">
        Discord
      </RegularAnchor>
      <RegularAnchor href="https://github.com/benawad/dogehouse/issues">
        Report a Bug
      </RegularAnchor>
      {/* cramps footer on mobile @todo think about how to incorporate this without cramping footer and making the footer really tall */}
      {/* <RegularAnchor
        href="https://github.com/benawad/dogehouse/blob/prod/CHANGELOG.md"
        target="_blank"
        rel="noreferrer"
      >
        What's new?
      </RegularAnchor> */}
    </div>
  );
};

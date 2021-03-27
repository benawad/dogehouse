import React from "react";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import { LanguageSelector } from "./LanguageSelector";
import { RegularAnchor } from "./RegularAnchor";

interface FooterProps {
  isLogin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isLogin }) => {
  const { t } = useTypeSafeTranslation();

  return (
    <div className={`flex text-center flex-wrap align-center justify-center`}>
      <div className={`flex space-x-4 m-auto`}>
        {isLogin ? (
          <RegularAnchor
            href="https://www.youtube.com/watch?v=hy-EhJ_tTQo"
            target="_blank"
            rel="noreferrer"
          >
            {t("footer.link_1")}
          </RegularAnchor>
        ) : null}
        <RegularAnchor
          href="https://discord.gg/wCbKBZF9cV"
          target="_blank"
          rel="noreferrer"
        >
          {t("footer.link_2")}
        </RegularAnchor>
        <RegularAnchor
          href="https://github.com/benawad/dogehouse/issues"
          target="_blank"
          rel="noreferrer"
        >
          {t("footer.link_3")}
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
      <div className={`flex m-auto`}>
        <LanguageSelector />
      </div>
    </div>
  );
};

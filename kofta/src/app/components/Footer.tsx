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
		<div className={`justify-between flex text-center`}>
			{isLogin ? (
				<RegularAnchor href="https://www.youtube.com/watch?v=hy-EhJ_tTQo">
					{t("footer.link_1")}
				</RegularAnchor>
			) : null}
			<RegularAnchor href="https://discord.gg/wCbKBZF9cV">
				{t("footer.link_2")}
			</RegularAnchor>
			<RegularAnchor href="https://github.com/benawad/dogehouse/issues">
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
			<LanguageSelector />
		</div>
	);
};

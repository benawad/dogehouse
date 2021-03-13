import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Logo } from "../svgs/Logo";
import { Link } from "react-router-dom";
import { BodyWrapper } from "../components/BodyWrapper";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface NotFoundPageProps {}

export const NotFoundPage: React.FC<NotFoundPageProps> = () => {
	const { t } = useTypeSafeTranslation();
	return (
		<Wrapper>
			<BodyWrapper>
				<div className={`mb-10 mt-8`}>
					<Logo />
				</div>
				<div className={`text-2xl`}>{t("pages.notFound.whoopsError")}</div>
				{t("pages.notFound.goHomeMessage")}
				<Link to="/" className={`text-blue-400 ml-2`}>
					{t("pages.notFound.goHomeLinkText")}
				</Link>
			</BodyWrapper>
		</Wrapper>
	);
};

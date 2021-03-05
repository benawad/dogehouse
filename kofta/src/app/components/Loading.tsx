import React from "react";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = () => {
	const { t } = useTypeSafeTranslation();
	return <div>{t("common.loading")}</div>;
};

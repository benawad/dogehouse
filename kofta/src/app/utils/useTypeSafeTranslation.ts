import { useTranslation } from "react-i18next";
import { TranslationKeys } from "../../generated/translationKeys";

export const useTypeSafeTranslation = () => {
	const { t } = useTranslation();

	return {
		t: (s: TranslationKeys, o?: any) => t(s, o),
	};
};

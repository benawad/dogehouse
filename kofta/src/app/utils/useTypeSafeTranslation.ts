import { useTranslation } from "react-i18next";
import { TranslationKeys } from "../../generated/translationKeys";

interface VariableTranslationType {
  time?: Date;
  date?: Date;
  count?: number;
}

export const useTypeSafeTranslation = () => {
  const { t } = useTranslation();

  return {
    t: (s: TranslationKeys, f?: VariableTranslationType) => t(s, f),
  };
};

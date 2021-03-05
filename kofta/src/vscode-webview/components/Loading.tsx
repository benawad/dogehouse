import React from "react";
import { useTranslation } from 'react-i18next';

interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = () => {
  const { t } = useTranslation();
  return <div>{t("common.loading")}</div>;
};

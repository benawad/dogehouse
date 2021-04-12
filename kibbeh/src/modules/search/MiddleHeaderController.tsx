import React from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import MiddleHeader from "../../ui/header/MiddleHeader";

interface SearchBarControllerProps {}

export const MiddleHeaderController: React.FC<SearchBarControllerProps> = ({}) => {
  const { t } = useTypeSafeTranslation();
  return (
    <MiddleHeader
      onSearchChange={() => {}}
      searchPlaceholder={t("components.search.placeholder")}
    />
  );
};

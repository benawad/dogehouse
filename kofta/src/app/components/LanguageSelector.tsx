import React from "react";
import { useTranslation } from "react-i18next";
import { Twemoji } from "./Twemoji";
import { Languages } from "../languages";

interface LanguageSelectorProps {}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({}) => {
    const { i18n } = useTranslation();
    const currentLang = Languages.find(lang => lang.value === i18n.language);
    const langEmoji = currentLang?.label.substring(0,4);
    return (
        <Twemoji rawEmoji={"🚩"} />
    );
};

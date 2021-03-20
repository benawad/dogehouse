import React from "react";
import { useTranslation } from "react-i18next";
import { Twemoji } from "./Twemoji";
import { Languages } from "../languages";

interface LanguageSelectorProps {}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({}) => {
  const { i18n } = useTranslation();
  let currentLang = Languages.find(lang => lang.value === i18n.language);
  let langEmoji = currentLang?.label.substring(0,4);
  return (
    // <select
    //   value={i18n.language}
    //   onChange={(e) => {
    //     i18n.changeLanguage(e.target.value);
    //   }}
    // >
    //   {options.map((o) => (
    //     <option key={o.value} value={o.value}>
    //       {o.label}
    //     </option>
    //   ))}
    // </select>
    <Twemoji emoji={langEmoji!} />
      );
};

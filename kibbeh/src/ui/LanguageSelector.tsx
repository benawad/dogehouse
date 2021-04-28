import React from "react";
import { useTranslation } from "react-i18next";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { Twemoji } from "./Twemoji";
import backIcon from "../icons/SolidCaretRight";
import { SettingsIcon } from "./SettingsIcon";

interface LanguageSelectorProps {
  onClose(): void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onClose,
}) => {
  const { t } = useTypeSafeTranslation();
  const { i18n } = useTranslation();

  const languages = [
    /* Languages that are in ISO 639-1 */
    { value: "en", flag: "🇬🇧", label: t("languages.english") },
    { value: "af", flag: "🇿🇦", label: t("languages.afrikaans") },
    { value: "am", flag: "🇪🇹", label: t("languages.amharic") },
    { value: "ar", flag: "🇸🇦", label: t("languages.arabic") },
    { value: "az", flag: "🇦🇿", label: t("languages.azerbaijani") },
    { value: "bg", flag: "🇧🇬", label: t("languages.bulgarian") },
    { value: "bn", flag: "🇧🇩", label: t("languages.bengali") },
    { value: "cs", flag: "🇨🇿", label: t("languages.czech") },
    { value: "da", flag: "🇩🇰", label: t("languages.danish") },
    { value: "de", flag: "🇩🇪", label: t("languages.german") },
    { value: "de-AT", flag: "🇦🇹", label: t("languages.germanAustria") },
    { value: "gsw", flag: "🇨🇭", label: t("languages.swissGerman") },
    { value: "el", flag: "🇬🇷", label: t("languages.greek") },
    { value: "eo", flag: "🟢", label: t("languages.esperanto") },
    { value: "es", flag: "🇪🇸", label: t("languages.spanish") },
    { value: "et", flag: "🇪🇪", label: t("languages.estonian") },
    { value: "eu", flag: "🇪🇸", label: t("languages.basque") },
    { value: "fa", flag: "🇮🇷", label: t("languages.persian") },
    { value: "fi", flag: "🇫🇮", label: t("languages.finnish") },
    { value: "fr", flag: "🇫🇷", label: t("languages.french") },
    { value: "he", flag: "🇮🇱", label: t("languages.hebrew") },
    { value: "hi", flag: "🇮🇳", label: t("languages.hindi") },
    { value: "hr", flag: "🇭🇷", label: t("languages.croatian") },
    { value: "hu", flag: "🇭🇺", label: t("languages.hungarian") },
    { value: "id", flag: "🇮🇩", label: t("languages.indonesian") },
    { value: "is", flag: "🇮🇸", label: t("languages.icelandic") },
    { value: "it", flag: "🇮🇹", label: t("languages.italian") },
    { value: "ja", flag: "🇯🇵", label: t("languages.japanese") },
    { value: "kk", flag: "🇰🇿", label: t("languages.kazakh") },
    { value: "ko", flag: "🇰🇷", label: t("languages.korean") },
    { value: "li", flag: "🇳🇱", label: t("languages.limburgish") },
    { value: "lt", flag: "🇱🇹", label: t("languages.lithuanian") },
    { value: "lv", flag: "🇱🇻", label: t("languages.latvian") },
    { value: "nb", flag: "🇳🇴", label: t("languages.norwegianBokmal") },
    { value: "ne", flag: "🇳🇵", label: t("languages.nepali") },
    { value: "nl", flag: "🇳🇱", label: t("languages.dutch") },
    { value: "pl", flag: "🇵🇱", label: t("languages.polish") },
    { value: "pt-BR", flag: "🇧🇷", label: t("languages.portugueseBrazil") },
    { value: "pt-PT", flag: "🇵🇹", label: t("languages.portuguesePortugal") },
    { value: "ro", flag: "🇷🇴", label: t("languages.romanian") },
    { value: "ru", flag: "🇷🇺", label: t("languages.russian") },
    { value: "si", flag: "🇱🇰", label: t("languages.sinhala") },
    { value: "sk", flag: "🇸🇰", label: t("languages.slovak") },
    { value: "sl", flag: "🇸🇮", label: t("languages.slovenian") },
    { value: "so", flag: "🇸🇴", label: t("languages.somali") },
    { value: "sq", flag: "🇦🇱", label: t("languages.albanian") },
    { value: "sr", flag: "🇷🇸", label: t("languages.serbian") },
    { value: "sr-LATIN", flag: "🇷🇸", label: t("languages.serbianLatin") },
    { value: "sv", flag: "🇸🇪", label: t("languages.swedish") },
    { value: "ta", flag: "🇮🇳", label: t("languages.tamil") },
    { value: "te", flag: "🇮🇳", label: t("languages.telugu") },
    { value: "th", flag: "🇹🇭", label: t("languages.thai") },
    { value: "tl", flag: "🇵🇭", label: t("languages.tagalog") },
    { value: "tr", flag: "🇹🇷", label: t("languages.turkish") },
    { value: "uk", flag: "🇺🇦", label: t("languages.ukrainian") },
    { value: "ur", flag: "🇵🇰", label: t("languages.urdu") },
    { value: "uz", flag: "🇺🇿", label: t("languages.uzbek") },
    { value: "vi", flag: "🇻🇳", label: t("languages.vietnamese") },
    { value: "zh-CN", flag: "🇨🇳", label: t("languages.chineseSimplified") },
    { value: "zh-TW", flag: "🇹🇼", label: t("languages.chineseTraditional") },
    { value: "tp", flag: "💛", label: t("languages.tokiPona"), novelty: true },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const noveltyLanguages = [
    /* Novelty languages */
    {
      value: "grc",
      flag: "🧓",
      label: t("languages.ancientGreek"),
    },
    {
      value: "en-PIRATE",
      flag: "☠️",
      label: t("languages.pirate"),
    },
    {
      value: "en-AU",
      flag: "🇦🇺",
      label: t("languages.australian"),
    },
    {
      value: "en-OWO",
      flag: "💕",
      label: t("languages.owoEnglish"),
    },
    {
      value: "bottom",
      flag: "🥺",
      label: t("languages.bottom"),
    },
  ];

  const options = [...languages, ...noveltyLanguages];

  const parsedOptions = options.map((e, i) => (
    <SettingsIcon
      key={e.value + i}
      classes={`text-primary-100 focus:outline-no-chrome whitespace-nowrap overflow-ellipsis${
        i18n.language === e.value ||
        (e.value === "en" && i18n.language === "en-US")
          ? " bg-primary-700"
          : ""
      }`}
      onClick={() => i18n.changeLanguage(e.value)}
      label={e.label}
      icon={e.flag as any}
    ></SettingsIcon>
  ));

  return (
    <div className="flex absolute h-full w-full z-20 bg-primary-800">
      <div className="block h-full w-full">
        <div className="block h-6 w-full border-b border-primary-700 sticky top-0 bg-primary-800">
          <button
            onClick={onClose}
            className="absolute left-3 text-primary-100 top-1/2 transform translate-y-n1/2 py-1 focus:outline-no-chrome hover:bg-primary-700 z-30 rounded-5"
            style={{ paddingLeft: "10px", paddingRight: "-6px" }}
          >
            {backIcon({ style: { transform: "rotate(180deg)" } })}
          </button>
          <div className="block relative text-center top-1/2 transform translate-y-n1/2 w-full font-bold text-primary-100">
            Language
          </div>
        </div>
        <div
          className="block h-full overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700"
          style={{ height: "calc(100% - 40px)" }}
        >
          <div className="block">{parsedOptions}</div>
        </div>
      </div>
    </div>
  );
};

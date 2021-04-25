import React from "react";
import { useTranslation } from "react-i18next";
import { useTypeSafeTranslation } from "../../src/shared-hooks/useTypeSafeTranslation";
import { Twemoji } from "./Twemoji";
import backIcon from "../icons/SolidCaretRight";
import { SettingsIcon } from "./SettingsIcon";

interface LanguageSelectorProps {
  onClose(): void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onClose,
}) => {
  const options = [
    { value: "en", label: "🇬🇧 English" }, // English

    /* Languages that are in ISO 639-1, sorted by language code (A-Z) */
    { value: "af", label: "🇿🇦 Afrikaans" }, // Afrikaans
    { value: "am", label: "🇪🇹 አማርኛ" }, // Amharic
    { value: "ar", label: "🇸🇦 عربي" }, // Arabic
    { value: "az", label: "🇦🇿 Azərbaycanca" }, // Azerbaijani
    { value: "bg", label: "🇧🇬 Български" }, // Bulgarian
    { value: "bn", label: "🇧🇩 বাংলা" }, // Bengali
    { value: "cs", label: "🇨🇿 Čeština" }, // Czech
    { value: "da", label: "🇩🇰 Dansk" }, // Danish
    { value: "de", label: "🇩🇪 Deutsch" }, // German
    { value: "de-AT", label: "🇦🇹 Deutsch (Österreich)" }, // German (Austria)
    { value: "gsw", label: "🇨🇭 Schwiizerdütsch" }, // Swiss German
    { value: "el", label: "🇬🇷 Ελληνικά" }, // Greek
    { value: "grc", label: "🧓 Αρχαία Ελληνικά" }, // Ancient Greek
    { value: "eo", label: "🟢 Esperanto" }, // Esperanto
    { value: "es", label: "🇪🇸 Español" }, // Spanish
    { value: "et", label: "🇪🇪 Eesti" }, // Estonian
    { value: "eu", label: "🇪🇸 Euskara" }, // Basque
    { value: "fa", label: "🇮🇷 فارسی" }, // Persian
    { value: "fi", label: "🇫🇮 Suomi" }, // Finnish
    { value: "fr", label: "🇫🇷 Français" }, // French
    { value: "he", label: "🇮🇱 עברית" }, // Hebrew
    { value: "hi", label: "🇮🇳 हिन्दी" }, // Hindi
    { value: "hr", label: "🇭🇷 Hrvatski" }, // Croatian
    { value: "hu", label: "🇭🇺 Magyar" }, // Hungarian
    { value: "id", label: "🇮🇩 Bahasa Indonesia" }, // Indonesian
    { value: "is", label: "🇮🇸 Íslenska" }, // Icelandic
    { value: "it", label: "🇮🇹 Italiano" }, // Italian
    { value: "ja", label: "🇯🇵 日本語" }, // Japanese
    { value: "kk", label: "🇰🇿 Қазақша" }, // Kazakh
    { value: "ko", label: "🇰🇷 한국어" }, // Korean
    { value: "li", label: "🇳🇱 Limburgs" }, // Limburgish
    { value: "lt", label: "🇱🇹 Lietuvių" }, // Lithuanian
    { value: "lv", label: "🇱🇻 Latviešu" }, // Latvian
    { value: "nb", label: "🇳🇴 Norsk Bokmål" }, // Norwegian Bokmål
    { value: "ne", label: "🇳🇵 नेपाली" }, // Nepali
    { value: "nl", label: "🇳🇱 Nederlands" }, // Dutch
    { value: "pl", label: "🇵🇱 Polski" }, // Polish
    { value: "pt-BR", label: "🇧🇷 Português (Brasil)" }, // Portuguese (Brazil)
    { value: "pt-PT", label: "🇵🇹 Português (Portugal)" }, // Portuguese (Portugal)
    { value: "ro", label: "🇷🇴 Română" }, // Romanian
    { value: "ru", label: "🇷🇺 Русский" }, // Russian
    { value: "si", label: "🇱🇰 සිංහල" }, // Sinhala
    { value: "sk", label: "🇸🇰 Slovenčina" }, // Slovak
    { value: "sl", label: "🇸🇮 Slovenščina" }, // Slovenian
    { value: "so", label: "🇸🇴 Af Soomaali" }, // Somali
    { value: "sq", label: "🇦🇱 Shqip" }, // Albanian
    { value: "sr", label: "🇷🇸 Српски" }, // Serbian
    { value: "sr-LATIN", label: "🇷🇸 Srpski" }, // Serbian (Latin)
    { value: "sv", label: "🇸🇪 Svenska" }, // Swedish
    { value: "ta", label: "🇮🇳 தமிழ்" }, // Tamil
    { value: "te", label: "🇮🇳 తెలుగు" }, // Telugu
    { value: "th", label: "🇹🇭 ไทย" }, // Thai
    { value: "tl", label: "🇵🇭 Tagalog" }, // Tagalog
    { value: "tr", label: "🇹🇷 Türkçe" }, // Turkish
    { value: "uk", label: "🇺🇦 Українська" }, // Ukrainian
    { value: "ur", label: "🇵🇰 اردو" }, // Urdu
    { value: "uz", label: "🇺🇿 Oʻzbek" }, // Uzbek
    { value: "vi", label: "🇻🇳 Tiếng Việt" }, // Vietnamese
    { value: "zh-CN", label: "🇨🇳 中文 (简体)" }, // Chinese (Simplified)
    { value: "zh-TW", label: "🇹🇼 正體中文 (繁體)" }, // Chinese (Traditional)

    /* Other languages */
    { value: "en-PIRATE", label: "☠️ Pirate" },
    { value: "en-AU", label: "🇦🇺 uɐᴉꞁɐɹʇsnⱯ" }, // Australian
    { value: "en-OWO", label: "💕 OwO Engwish" },
    { value: "bottom", label: "🥺 Bottom" },
    { value: "tp", label: "💛 Toki Pona" },
  ];

  const { i18n } = useTranslation();
  const { t } = useTypeSafeTranslation();

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
      icon={<Twemoji text={e.label} style={{ marginRight: "1ch" }} />}
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
          <p className="block relative text-center top-1/2 transform translate-y-n1/2 w-full font-semibold text-primary-100">
            {t("components.settingsDropdown.language")}
          </p>
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

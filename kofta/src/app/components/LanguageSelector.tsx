import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  options = [
    { value: "en", label: "🇬🇧 English" }, // English

    /* Languages that are in ISO 639-1, sorted by language code (A-Z) */
    { value: "so", label: "so Somali" }, // Somali
    { value: "af", label: "🇿🇦 Afrikaans" }, // Afrikaans
    { value: "am", label: "🇪🇹 አማርኛ" }, // Amharic
    { value: "ar", label: "🇸🇦 عربي" }, // Arabic
    { value: "at", label: "🇦🇹 Österreichisch" }, // Austrian
    { value: "fa", label: "🇮🇷 فارسی" }, // persian
    { value: "az", label: "🇦🇿 Azərbaycanca" }, // Azerbaijani
    { value: "bg", label: "🇧🇬 Български" }, // Bulgarian
    { value: "bn", label: "🇧🇩 বাংলা" }, // Bengali
    { value: "cs", label: "🇨🇿 Čeština" }, // Czech
    { value: "hr", label: "🇭🇷 Hrvatski" }, // Croatian
    { value: "da", label: "🇩🇰 Dansk" }, // Danish
    { value: "de", label: "🇩🇪 Deutsch" }, // German
    { value: "el-GR", label: "🇬🇷 Νέα Ελληνικά" }, //Greek
    { value: "ag-GR", label: "🇬🇷 Ancient Greek(Αρχαία Ελληνικά)" }, //Ancient Greek
    { value: "eo", label: "🟢 Esperanto" },
    { value: "es", label: "🇪🇸 Español" }, // Estonian
    { value: "eu", label: "🏴󠁥󠁳󠁰󠁶󠁿 Euskera" }, // Euskera
    { value: "et", label: "🇪🇪 Eesti keel" }, // Estonian
    { value: "fi", label: "🇫🇮 suomi" }, // Finnish
    { value: "fr", label: "🇫🇷 Français" }, // French
    { value: "he", label: "🇮🇱 עברית" }, // Hebrew
    { value: "hi", label: "🇮🇳 हिन्दी" }, // Hindi
    { value: "hu", label: "🇭🇺 magyar" }, // Hungarian
    { value: "id", label: "🇮🇩 Bahasa Indonesia" }, // Indonesian
    { value: "is", label: "🇮🇸 Íslenska" }, // Icelandic
    { value: "it", label: "🇮🇹 Italiano" }, // Italian
    { value: "ja", label: "🇯🇵 日本語" }, // Japanese
    { value: "ko", label: "🇰🇷 한국어" }, // Korean
    { value: "kz", label: "🇰🇿 Қазақша" }, // Kazakh
    { value: "lt", label: "🇱🇹 Lietuvių" }, // Lithuanian
    { value: "lv", label: "🇱🇻 Latviešu" }, // Latvian
    { value: "li", label: "🏴󠁮󠁬󠁬󠁩󠁿 Limburgs" }, // Limburgish
    { value: "nb", label: "🇳🇴 Norsk Bokmål" }, // Norwegian Bokmål
    { value: "ne", label: "🇳🇵 नेपाली" }, // Nepali
    { value: "nl", label: "🇳🇱 Nederlands" }, // Dutch
    { value: "pl", label: "🇵🇱 Polski" }, // Polish
    { value: "ph", label: "🇵🇭 Tagalog" }, // Philippines
    { value: "pt-BR", label: "🇧🇷 Português (do Brasil)" }, // Portuguese (Brazil)
    { value: "pt-PT", label: "🇵🇹 Português (Europeu)" }, // Portuguese (Portugal)
    { value: "ro", label: "🇷🇴 Română" }, // Romanian
    { value: "ru", label: "🇷🇺 Русский" }, // Russian
    { value: "si", label: "🇱🇰 සිංහල" }, //Sinhala
    { value: "sk", label: "🇸🇰 slovenčina" }, // Slovak
    { value: "sl", label: "🇸🇮 Slovenščina" }, // Slovenian
    { value: "sq", label: "🇦🇱 Shqip" }, // Albanian
    { value: "sr", label: "🇷🇸 Српски" }, // Serbian
    { value: "sr-LATIN", label: "🇷🇸 Srpski" }, // Serbian (Latin)
    { value: "sv", label: "🇸🇪 Svenska" }, // Swedish
    { value: "ta", label: "🇮🇳 Tamil" }, // Tamil
    { value: "te", label: "🇮🇳 తెలుగు"}, // Telugu
    { value: "th", label: "🇹🇭 ไทย" }, // Thai
    { value: "tr", label: "🇹🇷 Türkçe" }, // Turkish
    { value: "uk", label: "🇺🇦 Українська" }, // Ukrainian
    { value: "ur", label: "🇵🇰 اردو" }, // Urdu
    { value: "vi", label: "🇻🇳 Tiếng Việt" }, // Vietnamese
    { value: "zh-CN", label: "🇨🇳 中文 (简体)" }, // Chinese (Simplified)
    { value: "zh-TW", label: "🇹🇼 正體中文 (繁體)" }, // Chinese (Traditional)
    /* Languages that are in ISO 639-2 (three-letter codes) */
    { value: "gsw", label: "🇨🇭 Schwiizerdütsch" }, // Swiss German

    /* Other languages */
    { value: "en-PIRATE", label: "🏴‍☠️ Pirate" },
    { value: "en-AU", label: "🇦🇺 uɐᴉꞁɐɹʇsnⱯ" }, // Australian
    { value: "owo", label: "OwO Engwish" },
    { value: "bottom", label: "🥺 bottom"}
  ],
}) => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => {
        i18n.changeLanguage(e.target.value);
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

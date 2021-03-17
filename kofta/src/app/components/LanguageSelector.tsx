import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  options = [
    { value: "en", label: "🇬🇧 English" }, // English

    /* Languages that are in ISO 639, sorted by language code (A-Z) */
    { value: "af", label: "🇿🇦 Afrikaans" }, // Afrikaans
    { value: "am", label: "🇪🇹 አማርኛ" }, // Amharic
    { value: "ar", label: "🇸🇦 عربي" }, // Arabic
    { value: "az", label: "🇦🇿 Azərbaycanca" }, // Azerbaijani
    { value: "bg", label: "🇧🇬 Български"}, // Bulgarian
    { value: "bn", label: "🇧🇩 বাংলা" }, // Bengali
    { value: "cs", label: "🇨🇿 Čeština" }, // Czech
    { value: "da", label: "🇩🇰 Dansk" }, // Danish
    { value: "de", label: "🇩🇪 Deutsch" }, // German
    { value: "es", label: "🇪🇸 Español" }, // Estonian
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
    { value: "lt", label: "🇱🇹 Lietuvių" }, // Lithuanian
    { value: "nb", label: "🇳🇴 Norsk Bokmål" }, // Norwegian Bokmål
    { value: "ne", label: "🇳🇵 नेपाली" }, // Nepali
    { value: "nl", label: "🇳🇱 Nederlands" }, // Dutch
    { value: "pl", label: "🇵🇱 Polski" }, // Polish
    { value: "pt-PT", label: "🇵🇹 Português (Europeu)" }, // Portuguese (Portugal)
    { value: "pt-BR", label: "🇧🇷 Português (do Brasil)" }, // Portuguese (Brazil)
    { value: "ro", label: "🇷🇴 Română" }, // Romanian
    { value: "ru", label: "🇷🇺 Русский" }, // Russian
    { value: "sk", label: "🇸🇰 slovenčina" }, // Slovak
    { value: "sq", label: "🇦🇱 Shqip" }, // Albanian
    { value: "sr", label: "🇷🇸 Српски" }, // Serbian
    { value: "sr-Latin", label: "🇷🇸 Srpski" }, // Serbian (Latin)
    { value: 'sv', label: "🇸🇪 Svenska" }, // Swedish
    { value: "th", label: "🇹🇭 ไทย" }, // Thai
    { value: "tr", label: "🇹🇷 Türkçe" }, // Turkish
    { value: "uk", label: "🇺🇦 Українська" }, // Ukrainian
    { value: "ur", label: "🇵🇰 اردو" }, // Urdu
    { value: "zh-CN", label: "🇨🇳 中文 (简体)" }, // Chinese (Simplified)

    /* Other languages */
		{ value: "en-pirate", label: "🏴‍☠️ Pirate"},
    { value: "owo", label: "OwO english"},
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

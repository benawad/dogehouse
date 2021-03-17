import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  options = [
    { value: "en", label: "🇬🇧 English" },
    { value: "af", label: "🇿🇦 Afrikaans" },
    { value: "sq", label: "🇦🇱 Albanian" },
    { value: "am", label: "🇪🇹 Amharic" },
    { value: "ar", label: "🇸🇦 Arabic" },
		{ value: "az", label: "🇦🇿 Azerbaijani" },
    { value: "bn", label: "🇧🇩 Bangla" },
		{ value: "bg", label: "🇧🇬 Bulgarian"},
    { value: "zh-CN", label: "🇨🇳 Chinese (Simplified)" },
    { value: "zh-TW", label: "🇹🇼 Chinese (Traditional)" },
    { value: "cs", label: "🇨🇿 Czech" },
    { value: "da", label: "🇩🇰 Danish" },
    { value: "nl", label: "🇳🇱 Dutch" },
    { value: "et", label: "🇪🇪 Estonian" },
    { value: "fi", label: "🇫🇮 Finnish" },
    { value: "fr", label: "🇫🇷 French" },
    { value: "de", label: "🇩🇪 German" },
    { value: 'de-CH', label: "🇨🇭 German (Switzerland)" },
		{ value: 'el', label: "🇬🇷 Greek" },
    { value: "he", label: "🇮🇱 Hebrew" },
    { value: "hi", label: "🇮🇳 Hindi" },
    { value: "hu", label: "🇭🇺 Hungarian" },
    { value: "is", label: "🇮🇸 Icelandic" },
    { value: "id", label: "🇮🇩 Indonesian" },
    { value: "it", label: "🇮🇹 Italian" },
    { value: "ja", label: "🇯🇵 Japanese" },
		{ value: "ko", label: "🇰🇷 Korean"},
    { value: "lt", label: "🇱🇹 Lithuanian" },
    { value: "ne", label: "🇳🇵 Nepali" },
    { value: "nb", label: "🇳🇴 Norwegian (Bokmål)" },
    { value: "pl", label: "🇵🇱 Polish" },
    { value: "pt-PT", label: "🇵🇹 Portuguese" },
    { value: "pt-BR", label: "🇧🇷 Portuguese (Brazil)" },
		{ value: "ro", label: "🇷🇴 Romanian" },
    { value: "ru", label: "🇷🇺 Russian" },
    { value: "sr", label: "🇷🇸 Serbian (Cyrillic)" },
    { value: "sr-latin", label: "🇷🇸 Serbian (Latin)" },
    { value: "sk", label: "🇸🇰 Slovak" },
    { value: "es", label: "🇪🇸 Spanish" },
		{ value: 'sv', label: "🇸🇪 Swedish" },
    { value: "th", label: "🇹🇭 Thai" },
    { value: "tr", label: "🇹🇷 Turkish" },
    { value: "uk", label: "🇺🇦 Ukrainian" },
    { value: "ur", label: "🇵🇰 Urdu" },
	  { value: "en-owo", label: "OwO English"},
		{ value: "en-pirate", label: "🏴‍☠️ Pirate"},
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

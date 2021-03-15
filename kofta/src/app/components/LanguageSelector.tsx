import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  options = [
    { value: "en", label: "🇬🇧 English" },
    { value: "af", label: "🇿🇦 Afrikaans" },
    { value: "am", label: "🇪🇹 አማርኛ" },
    { value: "ar", label: "🇸🇦 عربي" },
    { value: "bn", label: "🇧🇩 বাংলা" },
    { value: "zh-CN", label: "🇨🇳 中文 (简体)" },
    { value: "cs", label: "🇨🇿 Ceština" },
    { value: "da", label: "🇩🇰 Dansk" },
    { value: "nl", label: "🇳🇱 Nederlands" },
    { value: "et", label: "🇪🇪 Eesti keel" },
    { value: "fi", label: "🇫🇮 suomi" },
    { value: "fr", label: "🇫🇷 Français" },
    { value: "de", label: "🇩🇪 Deutsch" },
    { value: "he", label: "🇮🇱 עברית" },
    { value: "hi", label: "🇮🇳 हिन्दी" },
    { value: "hu", label: "🇭🇺 magyar" },
    { value: "is", label: "🇮🇸 Íslenska" },
    { value: "id", label: "🇮🇩 Bahasa Indonesia" },
    { value: "it", label: "🇮🇹 Italiano" },
    { value: "ja", label: "🇯🇵 日本語" },
    { value: "lt", label: "🇱🇹 Lietuvių" },
    { value: "ne", label: "🇳🇵 नेपाली" },
    { value: "nb", label: "🇳🇴 Norsk Bokmål" },
    { value: "pl", label: "🇵🇱 Polski" },
    { value: "pt-PT", label: "🇵🇹 Português (Europeu)" },
    { value: "pt-BR", label: "🇧🇷 Português (do Brasil)" },
    { value: "ru", label: "🇷🇺 Русский" },
    { value: "sr", label: "🇷🇸 Српски (Cyrillic)" },
    { value: "sr-Latin", label: "🇷🇸 Српски (Latin)" },
    { value: "es", label: "🇪🇸 Español" },
    { value: "th", label: "🇹🇭 ไทย" },
    { value: "tr", label: "🇹🇷 Türkçe" },
    { value: "uk", label: "🇺🇦 Українська" },
    { value: "ur", label: "🇵🇰 اردو" },
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

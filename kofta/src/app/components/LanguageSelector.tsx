import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
	options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	options = [
		{ "value": "en", "label": "🇬🇧 en" },
		{ "value": "cs", "label": "🇨🇿 cs" },
		{ "value": "de", "label": "🇩🇪 de" },
		{ "value": "es", "label": "🇪🇸 es" },
		{ "value": "fr", "label": "🇫🇷 fr" },
		{ "value": "he", "label": "🇮🇱 he" },
		{ "value": "hi", "label": "🇮🇳 hi" },
		{ "value": "hu", "label": "🇭🇺 hu" },
		{ "value": "id", "label": "🇮🇩 id" },
		{ "value": "it", "label": "🇮🇹 it" },
		{ "value": "lt", "label": "🇱🇹 lt" },
		{ "value": "nb", "label": "🇳🇴 nb" },
		{ "value": "nl", "label": "🇧🇶 nl" },
		{ "value": "pl", "label": "🇵🇱 pl" },
		{ "value": "pt-BR", "label": "🇵🇹 pt-br" },
		{ "value": "pt-PT", "label": "🇵🇹 pt-pt" },
		{ "value": "ru", "label": "🇷🇺 ru" },
		{ "value": "th", "label": "🇹🇭 th" },
		{ "value": "tr", "label": "🇹🇷 tr" },
		{ "value": "zh-CN", "label": "🇨🇳 zh-cn" }
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

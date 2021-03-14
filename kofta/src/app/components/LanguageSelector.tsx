import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
	options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	options = [
		{ value: "en", label: "English" },
		{ value: "af", label: "Afrikaans" },
		{ value: "ar", label: "Arabic" },
		{ value: "bn", label: "Bangla" },
		{ value: "zh-CN", label: "Chinese (Simplified)" },
		{ value: "cs", label: "Czech" },
		{ value: "da", label: "Danish" },
		{ value: "nl", label: "Dutch" },
		{ value: "et", label: "Estonian" },
		{ value: "fi", label: "Finnish" },
		{ value: "fr", label: "French" },
		{ value: "de", label: "German" },
		{ value: "he", label: "Hebrew" },
		{ value: "hi", label: "Hindi" },
		{ value: "hu", label: "Hungarian" },
		{ value: "id", label: "Indonesian" },
		{ value: "it", label: "Italian" },
		{ value: "ja", label: "Japaneese" },
		{ value: "lt", label: "Lithuanian" },
		{ value: "ne", label: "Nepali" },
		{ value: "nb", label: "Norwegian" },
		{ value: "pl", label: "Polish" },
		{ value: "pt-PT", label: "Portuguese" },
		{ value: "pt-BR", label: "Portuguese (Brazil)" },
		{ value: "ru", label: "Russian" },
		{ value: "sr", label: "Serbian" },
		{ value: "es", label: "Spanish" },
		{ value: "th", label: "Thai" },
		{ value: "tr", label: "Turkish" },
		{ value: "ur", label: "Urdu" }
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

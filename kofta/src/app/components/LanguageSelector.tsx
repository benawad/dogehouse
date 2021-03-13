import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
	options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	options = [
		{ value: "en", label: "English" },
		{ value: "ar", label: "Arabic" },
		{ value: "cs", label: "Czech" },
		{ value: "de", label: "German" },
		{ value: "es", label: "Spanish" },
		{ value: "fi", label: "Finnish" },
		{ value: "fr", label: "French" },
		{ value: "he", label: "Hebrew"},
		{ value: "hi", label: "Hindi"},
		{ value: "hu", label: "Hungarian"},
		{ value: "id", label: "Indonesian" },
		{ value: "it", label: "Italian" },
		{ value: "lt", label: "Lithuanian" },
		{ value: "nb", label: "Norwegian" },
		{ value: "ne", label: "Nepali" },
		{ value: "nl", label: "Dutch" },
		{ value: "pl", label: "Polish" },
		{ value: "ur", label: "Urdu" },																															
		{ value: "pt-BR", label: "Portuguese (Brazil)" },
		{ value: "pt-PT", label: "Portuguese (Portugal)" },
		{ value: "ru", label: "Russian" },
		{ value: "th", label: "Thai" },
		{ value: "tr", label: "Turkish" },
		{ value: "zh-CN", label: "Chinese (Simplified)" },
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

import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
	options?: Array<{ value: string; label: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	options = [
		{ value: "en", label: "English" },
		{ value: "de", label: "Deutsch" },
		{ value: "es", label: "Spanish" },
		{ value: "fr", label: "Français" },
		{ value: "he", label: "Hebrew" },
		{ value: "hu", label: "Hungarian" },
		{ value: "nb", label: "Norwegian" },
		{ value: "pt-BR", label: "Portuguese(Brazil)" },
		{ value: "pt-PT", label: "Portuguese" },
		{ value: "tr", label: "Turkish" },
		{ value: "zh-CN", label: "Chinese(Simplified)" }
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

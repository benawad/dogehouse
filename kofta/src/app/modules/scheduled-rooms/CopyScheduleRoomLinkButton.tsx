import React, { useState } from "react";
import { Link2 } from "react-feather";
import { copyTextToClipboard } from "../../utils/copyToClipboard";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";

interface CopyLinkButtonProps {
	text: string;
}

export const CopyScheduleRoomLinkButton: React.FC<CopyLinkButtonProps> = ({
	text,
}) => {
	const [copied, setCopied] = useState(false);
	const { t } = useTypeSafeTranslation();
	return (
		<button
			type="button"
			className="chq-atc--button flex"
			onClick={() => {
				if (copyTextToClipboard(text)) {
					setCopied(true);
				}
			}}
		>
			<Link2 className="mr-2" />
			{copied ? t("common.copied") : t("common.copyLink")}
		</button>
	);
};

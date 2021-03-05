import React, { useEffect } from "react";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface MuteTitleUpdaterProps {}

export const MuteTitleUpdater: React.FC<MuteTitleUpdaterProps> = ({}) => {
	const { muted } = useMuteStore();
	const { t } = useTypeSafeTranslation();
	useEffect(() => {
		if (muted) {
			document.title = t("header.mutedTitle");
		} else {
			document.title = t("header.title");
		}
	}, [muted, t]);
	return null;
};

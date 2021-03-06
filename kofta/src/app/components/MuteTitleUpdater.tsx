import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface MuteTitleUpdaterProps {}

export const MuteTitleUpdater: React.FC<MuteTitleUpdaterProps> = ({}) => {
	const { muted } = useMuteStore();
	const location = useLocation();
	const { t } = useTypeSafeTranslation();
	useEffect(() => {
		if (muted && location.pathname.startsWith('/room')) {
			document.title = t("header.mutedTitle");
		} else {
			document.title = t("header.title");
		}
	}, [muted, t, location.pathname]);
	return null;
};

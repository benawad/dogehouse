import React, { useEffect } from "react";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";

interface MuteTitleUpdaterProps {}

export const MuteTitleUpdater: React.FC<MuteTitleUpdaterProps> = ({}) => {
	const { muted } = useMuteStore();
	const { currentRoom } = useCurrentRoomStore();
	const { t } = useTypeSafeTranslation();
	useEffect(() => {
		if (muted && currentRoom) {
			document.title = t("header.mutedTitle");
		} else {
			document.title = t("header.title");
		}
	}, [muted, t, currentRoom]);
	return null;
};

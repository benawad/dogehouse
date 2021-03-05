import React, { useState } from "react";
import { useMicPermErrorStore } from "../../webrtc/stores/useMicPermErrorStore";
import { sendVoice } from "../../webrtc/utils/sendVoice";
import { isIOS } from "../utils/isIOS";
import { Button } from "./Button";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface MicPermissionBannerProps {}

export const MicPermissionBanner: React.FC<MicPermissionBannerProps> = () => {
	const { error, set } = useMicPermErrorStore();
	const [count, setCount] = useState(0);
	const { t } = useTypeSafeTranslation();
	if (!error) {
		return null;
	}
	return (
		<div className={`p-4 bg-simple-gray-3c`}>
			<div className={`font-semibold text-xl mb-4 bg-red-400`}>
				{t("components.micPermissionBanner.permissionDenied")}
			</div>
			<div className="flex space-x-2">
				<Button color="secondary" onClick={() => set({ error: false })}>
					{t("components.micPermissionBanner.dismiss")}
				</Button>
				<Button
					onClick={() => {
						if (count < 2 && !isIOS()) {
							sendVoice();
							setCount((c) => c + 1);
						} else {
							window.location.reload();
						}
					}}
				>
					{t("components.micPermissionBanner.tryAgain")}
				</Button>
			</div>
		</div>
	);
};

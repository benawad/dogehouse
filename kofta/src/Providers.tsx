import { Provider } from "jotai";
import React from "react";
import { QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { AlertModal } from "./app/components/AlertModal";
import { ConfirmModal } from "./app/components/ConfirmModal";
import { InvitedToJoinRoomModal } from "./app/components/InvitedToJoinRoomModal";
import { MuteTitleUpdater } from "./app/components/MuteTitleUpdater";
import { PromptModal } from "./app/components/PromptModal";
import { SoundEffectPlayer } from "./app/modules/sound-effects/SoundEffectPlayer";
import { queryClient } from "./app/queryClient";

interface ProvidersProps {}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
	return (
		<Provider>
			<QueryClientProvider client={queryClient}>
				{children}
				<SoundEffectPlayer />
				<ToastContainer />
				<MuteTitleUpdater />
				<InvitedToJoinRoomModal />
				<AlertModal />
				<PromptModal />
				<ConfirmModal />
			</QueryClientProvider>
		</Provider>
	);
};

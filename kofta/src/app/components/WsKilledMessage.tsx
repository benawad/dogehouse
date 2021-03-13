import React from "react";
import { createWebSocket } from "../../createWebsocket";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import { Button } from "./Button";
import { CenterLayout } from "./CenterLayout";
import { Wrapper } from "./Wrapper";

interface WsKilledMessageProps {}

export const WsKilledMessage: React.FC<WsKilledMessageProps> = ({}) => {
	const { t } = useTypeSafeTranslation();

	return (
		<div className="flex items-center h-full justify-around">
			<CenterLayout>
				<Wrapper>
					<div className={`px-4`}>
						<div className={`mb-4 mt-8 text-xl`}>
							{t("components.wsKilled.description")}
						</div>
						<Button
							onClick={() => {
								createWebSocket(true);
							}}
						>
							{t("components.wsKilled.reconnect")}
						</Button>
					</div>
				</Wrapper>
			</CenterLayout>
		</div>
	);
};

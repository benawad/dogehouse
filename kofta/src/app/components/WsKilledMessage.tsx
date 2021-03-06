import React from "react";
import { createWebSocket } from "../../createWebsocket";
import { Button } from "./Button";
import { CenterLayout } from "./CenterLayout";
import { Wrapper } from "./Wrapper";

interface WsKilledMessageProps {}

export const WsKilledMessage: React.FC<WsKilledMessageProps> = ({}) => {
	return (
		<div className="flex items-center h-full justify-around">
			<CenterLayout>
				<Wrapper>
					<div className={`px-4`}>
						<div className={`mb-4 mt-8 text-xl`}>
							Websocket was killed by the server. This usually happens when you
							open the website in another tab.
						</div>
						<Button
							onClick={() => {
								createWebSocket();
							}}
						>
							reconnect
						</Button>
					</div>
				</Wrapper>
			</CenterLayout>
		</div>
	);
};

import { useEffect } from "react";
import { useTokenStore } from "./useTokenStore";
import queryString from "query-string";
import { createWebSocket } from "../../createWebsocket";

export const useSaveTokensFromQueryParams = () => {
	useEffect(() => {
		const params = queryString.parse(window.location.search);
		if (
			typeof params.accessToken === "string" &&
			typeof params.refreshToken === "string" &&
			params.accessToken &&
			params.refreshToken
		) {
			useTokenStore.getState().setTokens({
				accessToken: params.accessToken,
				refreshToken: params.refreshToken,
			});
			createWebSocket();
			window.history.replaceState({}, document.title, "/");
		}
	}, []);
};

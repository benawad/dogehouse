import create from "zustand";
import { combine } from "zustand/middleware";
import { createWebSocket } from "../../createWebsocket";
import { __prod__ } from "../constants";

const accessTokenKey = "@toum/token" + (__prod__ ? "" : "dev");
const refreshTokenKey = "@toum/refresh-token" + (__prod__ ? "" : "dev");

const getDefaultValues = () => {
	try {
		const accessToken = localStorage.getItem(accessTokenKey) || "";
		const refreshToken = localStorage.getItem(refreshTokenKey) || "";
		if (accessToken && refreshToken) {
			createWebSocket();
		}
		return {
			accessToken,
			refreshToken,
		};
	} catch {
		return {
			accessToken: "",
			refreshToken: "",
		};
	}
};

export const useTokenStore = create(
	combine(getDefaultValues(), (set) => ({
		setTokens: (x: { accessToken: string; refreshToken: string }) => {
			try {
				localStorage.setItem(accessTokenKey, x.accessToken);
				localStorage.setItem(refreshTokenKey, x.refreshToken);
			} catch {}

			set(x);
		},
	}))
);

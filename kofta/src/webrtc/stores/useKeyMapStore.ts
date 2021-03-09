import { KeyMap } from "react-hotkeys";
import create from "zustand";
import { combine } from "zustand/middleware";

const MUTE_KEY = "@keybind/mute";
const CHAT_KEY = "@keybind/chat";
const PTT_KEY = "@keybind/ptt";

function getMuteKeybind() {
	let v = "";
	try {
		v = localStorage.getItem(MUTE_KEY) || "";
	} catch {}

	return v || "Control+m";
}

function getChatKeybind() {
	let v = "";
	try {
		v = localStorage.getItem(CHAT_KEY) || "";
	} catch {}

	return v || "Control+9";
}

function getPTTKeybind() {
	let v = "";
	try {
		v = localStorage.getItem(PTT_KEY) || "";
	} catch {}

	return v || "Control+0";
}

const keyMap: KeyMap = {
	MUTE: getMuteKeybind(),
	CHAT: getChatKeybind(),
	PTT: [
		{ sequence: getPTTKeybind(), action: "keydown" },
		{ sequence: getPTTKeybind(), action: "keyup" },
	],
};

const keyNames: KeyMap = {
	MUTE: getMuteKeybind(),
	CHAT: getChatKeybind(),
	PTT: getPTTKeybind(),
};

export const useKeyMapStore = create(
	combine(
		{
			keyMap,
			keyNames,
		},
		(set) => ({
			setMuteKeybind: (id: string) => {
				try {
					localStorage.setItem(MUTE_KEY, id);
				} catch {}
				set((x) => ({
					keyMap: { ...x.keyMap, MUTE: id },
					keyNames: { ...x.keyNames, MUTE: id },
				}));
			},
			setChatKeybind: (id: string) => {
				try {
					localStorage.setItem(CHAT_KEY, id);
				} catch {}
				set((x) => ({
					keyMap: { ...x.keyMap, CHAT: id },
					keyNames: { ...x.keyNames, CHAT: id },
				}));
			},
			setPTTKeybind: (id: string) => {
				try {
					localStorage.setItem(PTT_KEY, id);
				} catch {}
				set((x) => ({
					keyMap: {
						...x.keyMap,
						PTT: [
							{ sequence: id, action: "keydown" },
							{ sequence: id, action: "keyup" },
						],
					},
					keyNames: { ...x.keyNames, PTT: id },
				}));
			},
		})
	)
);

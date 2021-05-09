import { MessageToken, MessageTokenType, Unitoken } from "../util/types/token";
import { newToken } from "./token";

export function filterUnitoken(token: any): MessageToken | null {
	const keys = Object.keys(token);
	const allowedKeys = ['mention', 'emote', 'block', 'link'];

	if (keys.length > 1 || !allowedKeys.includes(keys[0])) return null;

	const key = keys[0];

	const mention = token['mention'] ?? "invalidMention";
	const emote = token['emote'] ?? "invalidEmote";
	const block = token['block'] ?? "invalidBlock";
	const link = token['link'] ?? "https://invalid.link";
	const text = token['text'] ?? "invalidText";

	if (key == 'mention') return newToken('mention', mention);
	if (key == 'emote') return newToken("emote", emote);
	if (key == 'block') return newToken("block", block);
	if (key == 'link') return newToken("link", link);
	if (key == 'text') return newToken("text", text);

	return null;
}
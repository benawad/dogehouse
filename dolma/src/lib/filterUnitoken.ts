import { MessageToken, MessageTokenType, Unitoken } from "../util/types/tokenTypes";
import { msgToken } from "./msgToken";

const newToken = msgToken.newToken;

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

  switch (key) {
    case 'mention':
      return newToken('mention', mention);
    case 'emote':
      return newToken("emote", emote);
    case 'block':
      return newToken("block", block);
    case 'link':
      return newToken("link", link);
    case 'text':
      return newToken("text", text);
  }

	return null;
}

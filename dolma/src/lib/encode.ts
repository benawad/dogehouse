import { MessageToken, Unitoken } from "../util/types/token";
import { decodeTokens } from "./decode";
import { filterString } from "./filterString";
import { filterUnitoken } from "./filterUnitoken";

export function encodeTokens(message: Array<Unitoken | MessageToken | string> | string): MessageToken[] {
	const tokens: MessageToken[] = [];
	if (!message) return tokens;

	if (typeof message == 'string') {
		filterString(message).map(tk => tokens.push(tk));
		return tokens;
	}

	if (typeof message == 'object') {
		message.forEach((item: any, index) => {
			const unitoken = filterUnitoken(item);
			const isToken = Object.keys(item).includes('t') && Object.keys(item).includes('v');

			if (typeof item == 'string') return filterString(item).map(tk => tokens.push(tk));
			if (unitoken !== null) return tokens.push(unitoken);
			if (isToken) return tokens.push(item);

			return;
		})
	}

	return tokens;
}
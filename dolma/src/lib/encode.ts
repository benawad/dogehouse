import { Unitoken } from "../tokens";
import { MessageToken } from "../util/types/tokenTypes";
import { decodeTokens } from "./decode";
import { filterString } from "./filterString";
import { filterUnitoken } from "./filterUnitoken";

export function encodeTokens(this: {emotes: {name: string}[]},message: Array<Unitoken | MessageToken | string> | string) {
	const tokens: MessageToken[] = [];
	if (!message) return {tokens: tokens, whisperedTo: []};

	if (typeof message == 'string') {
		console.log(this.emotes);
		return filterString(this.emotes, message)
	}

	// if (typeof message == 'object') {
	// 	message.forEach((item: any, index) => {
	// 		const unitoken = filterUnitoken(item);
	// 		const isToken = Object.keys(item).includes('t') && Object.keys(item).includes('v');

	// 		if (typeof item == 'string') return filterString(item).map(tk => tokens.push(tk));
	// 		if (unitoken !== null) return tokens.push(unitoken);
	// 		if (isToken) return tokens.push(item);

	// 		return;
	// 	})
	// }

	return {tokens: tokens, whisperedTo: []};
}

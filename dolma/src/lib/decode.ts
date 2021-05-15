import dolma from "../index";
import { Unitoken } from "../tokens";
import { MessageToken } from "../util/types/tokenTypes";
import { encodeTokens } from "./encode";

export function decodeTokens(this: {emotes: {name: string}[]}, all: Array<Unitoken | MessageToken | string> | string): string {
	const tokens = new dolma(this.emotes).encode(all);
	let vals: string[] = [];

	tokens.tokens.map(tkn => {
		if (tkn.t == 'text') return vals.push(tkn.v);
		if (tkn.t == 'block') return vals.push(`\`${tkn.v}\``);
		if (tkn.t == 'emote') return vals.push(`:${tkn.v}:`);
		if (tkn.t == 'mention') return vals.push(`@${tkn.v}`);
		if (tkn.t == 'link') return vals.push(tkn.v);
	});

	let ret: string[] = [];
	const len = vals.length
	vals.forEach((val, index) => {
		const strayValues = [",", "."]
		if (strayValues.includes(val)) {
			ret[ret.length-1] += val;
		} else {
			ret.push(val);
		}
	});

	return ret.join(' ');
}

import { validationRegex } from "../util/regex";
import { MessageToken, MessageTokenType } from "../util/types/token";

export function newToken(token: MessageTokenType, value: string): MessageToken {
	const genToken = (t: MessageTokenType, v: string) => { return {t, v} }

	let tkn = token;
	let val = value;

	if (tkn == 'block') val = value.trim();

	return genToken(tkn, val);
	
}

export const validator = {
	getBlock(str: string): string | false {
		if (str.match(validationRegex.block)) return str.replace(validationRegex.block, '$1');
		else return false;
	},

	getEmote(str: string): string | false {
		if (str.match(validationRegex.emote)) return str.replace(validationRegex.emote, '$1');
		else return false;
	},

	getMention(str: string): string | false {
		if (str.match(validationRegex.mention)) return str.replace(validationRegex.mention, '$1');
		else return false;
	},

	getLink(str: string): string | false {
		if (str.match(validationRegex.link)) return str.replace(validationRegex.link, '$1');
		else return false;
	}
}
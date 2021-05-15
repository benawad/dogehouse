import { validationRegex } from "../util/regex";
import { MessageToken, MessageTokenType } from "../util/types/tokenTypes";

import * as rawTokens from '../tokens';

//@ts-ignore
const tokenTypes: MessageTokenType[] = Object.keys(rawTokens.default);

export function msgToken() {

}

msgToken.tokens = rawTokens.default;
msgToken.types = tokenTypes;

msgToken.getUnitoken = (token: rawTokens.Unitoken): MessageTokenType | null => {
	const utKeys = Object.keys(token);
	let tkn: MessageTokenType = 'text';

	tokenTypes.map(tt => { if (tt == utKeys[0]) tkn = tt });

	return tkn;
}

msgToken.get = (tokenType: MessageTokenType) => {
	const tkn = rawTokens.default[tokenType];
	return tkn;
}

msgToken.getType = (raw: string): MessageTokenType => {
	let type: MessageTokenType = 'text';
	tokenTypes.forEach(tt => {
		if (msgToken.validate(tt, raw)) {
			type = tt;
		}
	});
	return type;
}

msgToken.getValue = (tkn: MessageTokenType, raw: string): string => {
	const regex = msgToken.get(tkn).regex;
	if (!regex) return raw;
	else return raw;
}

msgToken.newToken = (tk: MessageTokenType, value: string) => {
	const genToken = (t: MessageTokenType, v: string) => { return { t, v } }
	let val = msgToken.get(tk).format(value);
	return genToken(tk, val);
}

msgToken.validate = (token: MessageTokenType, str: string): string | false => {
	const tkn = msgToken.get(token);
	if (!tkn.regex) return str;

	if (str.match(tkn.regex)) return str.replace(tkn.regex, '$1');
	else return false;
}

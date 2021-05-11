import { validationRegex } from "../util/regex";
import { MessageToken, MessageTokenType } from "../util/types/tokenTypes";

import * as rawTokens from '../tokens';

//@ts-ignore
const tokenTypes: MessageTokenType[] = Object.keys(rawTokens.default); 

export function msgToken() {

}

msgToken.tokens = rawTokens.default;
msgToken.types = tokenTypes;

msgToken.get = (tokenType: MessageTokenType) => {
	const tkn = rawTokens.default[tokenType];
	return tkn;
}

msgToken.getType = (raw: string): MessageTokenType => {
	let type = null;
	tokenTypes.forEach(tt => {
		if (msgToken.validate(tt, raw)) {
			type = tt;
		}
	});

	if (!type) return 'text';
	return type;
}

msgToken.getValue = (tkn: MessageTokenType, raw: string): string =>  {
	const regex = msgToken.get(tkn).regex;
	if (!regex) return raw;
	return msgToken.get(tkn).format(raw.replace(regex, '$1'));
}

msgToken.newToken = (tk: MessageTokenType, value: string) => {
	const genToken = (t: MessageTokenType, v: string) => { return {t, v} }
	let val = msgToken.get(tk).format(value);
	return genToken(tk, val);
}

msgToken.validate = (token: MessageTokenType, str: string): string | false => {
	const tkn = msgToken.get(token);
	if (!tkn.regex) return str;

	if (str.match(tkn.regex)) return str.replace(tkn.regex, '$1');
	return false;
}

import { validationRegex } from "../util/regex";
import { MessageToken, MessageTokenType } from "../util/types/tokenTypes";
import { msgToken } from "./msgToken";

export function filterString(message: string) {
	const tokens: MessageToken[] = []
	const vals = message.trim().split(validationRegex.global).filter(e => e != "" && e != " " && e != undefined).map(e => e.trim());

	vals.map(e => {		
		let tkn = msgToken.getType(e);
		let value = msgToken.getValue(tkn, e);

		return tokens.push(msgToken.newToken(tkn, value));
	});

	return tokens;
}
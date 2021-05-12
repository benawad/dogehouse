import { MessageToken, MessageTokenType } from "../util/types/tokenTypes";
import { msgToken } from "./msgToken";

const newToken = msgToken.newToken;

export function filterUnitoken(token: any): MessageToken | null {
	const keys = Object.keys(token);
	const tkn = msgToken.getUnitoken(token);
	if (keys.length > 1) return null;
	if (tkn == null) return null;
	
	return newToken(tkn, token[tkn]);
}
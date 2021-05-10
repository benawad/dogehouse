import { decodeTokens } from "./lib/decode";
import { encodeTokens } from "./lib/encode";
import { MessageToken, Unitoken } from "./util/types/tokenTypes";

interface RootMethodResponse {
	encoded: MessageToken[],
	decoded: string
}

export * from './util/types/tokenTypes';

export function dolma(values?: Array<Unitoken | MessageToken | string> | string): RootMethodResponse {
	return {
		encoded: encodeTokens(values ?? ""),
		decoded: decodeTokens(values ?? "")
	}
}

dolma['encode'] = encodeTokens;
dolma['decode'] = decodeTokens;

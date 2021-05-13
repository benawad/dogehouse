import { decodeTokens } from "./lib/decode";
import { encodeTokens } from "./lib/encode";
import { Unitoken } from "./tokens";
import { MessageToken } from "./util/types/tokenTypes";

interface RootMethodResponse {
	encoded: MessageToken[],
	decoded: string
}

export * from './util/types/tokenTypes';

export default function dolma(values?: Array<Unitoken | MessageToken | string> | string): RootMethodResponse {
	return {
		encoded: encodeTokens(values ?? ""),
		decoded: decodeTokens(values ?? "")
	}
}

dolma['encode'] = encodeTokens;
dolma['decode'] = decodeTokens;

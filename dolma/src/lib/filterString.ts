import { validationRegex } from "../util/regex";
import { MessageToken } from "../util/types/token";
import { newToken, validator } from "./token";

export function filterString(message: string) {
	const tokens: MessageToken[] = []
	const vals = message.trim().split(validationRegex.global).filter(e => e != "" && e != " " && e != undefined).map(e => e.trim());

	vals.forEach(e => {
		const block = validator.getBlock(e);
		const mention = validator.getMention(e);
		const emote = validator.getEmote(e);
		const link = validator.getLink(e);

		if (block) return tokens.push(newToken('block', block));
		if (mention) return tokens.push(newToken('mention', mention)); 
		if (emote) return tokens.push(newToken('emote', emote)); 
		if (link) return tokens.push(newToken('link', link)); 

		e.split(" ").map(str => tokens.push(newToken('text', str)));
	});

	return tokens;
}
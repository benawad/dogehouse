import { validationRegex } from "../util/regex";
import { MessageToken, MessageTokenType } from "../util/types/tokenTypes";
import { msgToken } from "./msgToken";

export function filterString(emotes: { name: string }[], message: string) {
  const tokens: MessageToken[] = [];
  const vals = message
    .split(validationRegex.global)
    .filter((e) => e != undefined && e != "")
    .map((e) => e);
  const whispers = message.split(/^\#\@([A-z0-9_]{4,})/gi)[1];

  vals.map((e) => {
    let tkn = msgToken.getType(e);
    if (tkn == "emote") {
			emotes.find((emote) => `:${emote.name}:` == e.trim()) ? "" : tkn = "text";
    }
    if (tkn == "mention") {
      e = e.substr(1);
    }
    let value = msgToken.getValue(tkn, e);

    return tokens.push(msgToken.newToken(tkn, value));
  });

  return { tokens, whisperedTo: whispers ? [whispers] : [] };
}

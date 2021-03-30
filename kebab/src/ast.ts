import { MessageToken, TextToken } from "./entities";

export const stringToToken = (string: string): [TextToken] => [{ t: "text", v: string }];
export const tokensToString = (tokens: MessageToken[]): string => tokens
  .map(it => {
    switch(it.t) {
      case "text": return it.v;
      case "mention": return `@${it.v}`;
      case "link": return it.v;
      case "emote": return `:${it.v}:`;
      case "block": return `\`${it.v}\``;
      default: return "";
    }
  })
  .join(" ");

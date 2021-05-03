import { MessageToken, TextToken } from "..";

/**
 * 
 * @param string The string you want to convert to TextTokens
 * @returns `TextToken[]`
 */
export const stringToToken = (string: string): [TextToken] => [{ t: "text", v: string }];

/**
 * @param tokens MessageTokens to be converted to string
 * @returns `string`
 */
export const tokensToString = (tokens: MessageToken[]): string => tokens
  .map(it => {
    switch (it.t) {
      case "text": return it.v;
      case "mention": return `@${it.v}`;
      case "link": return it.v;
      case "emote": return `:${it.v}:`;
      case "block": return `\`${it.v}\``;
      default: return "";
    }
  })
  .join(" ");

import { User } from "../types";
import splitOnFirst from "split-on-first";

export const createChatMessage = (message: string, mentions: User[]) => {
  const tokens = ([] as unknown) as [
    {
      t: string;
      v: string;
    }
  ];

  let i = 0;
  // recursive function to create tokens
  function createTokens(message: string) {
    const mention = mentions[i];
    if (mention) {
      const chunk = splitOnFirst(message, "@" + mention.username);
      if (chunk.length > 1)
        tokens.push({
          t: "mention",
          v: "@" + mention.username
        });

      if (chunk[0])
        tokens.push({
          t: "text",
          v: message
        });
      i++;
      if (chunk[1]) createTokens(chunk[1]);
    } else {
      tokens.push({
        t: "text",
        v: message
      });
    }
  }
  createTokens(message);
  return tokens;
};

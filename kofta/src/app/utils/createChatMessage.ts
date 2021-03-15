import { linkRegex } from "./../constants";
import { BaseUser } from "../types";

// @ts-ignore
import normalizeUrl from "normalize-url";

export const createChatMessage = (
  message: string,
  mentions: BaseUser[],
  roomUsers: BaseUser[] = []
) => {
  const tokens = ([] as unknown) as [
    {
      t: string;
      v: string;
    }
  ];

  const whisperedToUsernames: string[] = [];

  let isBlock = false;
  message.split(" ").forEach((item) => {
    const isLink = linkRegex.test(item);
    const withoutAt = item.replace(/@|#/g, "");
    const isMention = mentions.find((m) => withoutAt === m.username);

    // whisperedTo users list
    !isMention ||
      item.indexOf("#@") !== 0 ||
      whisperedToUsernames.push(withoutAt);

    if (isLink || isMention) {
      tokens.push({
        t: isLink ? "link" : "mention",
        v: isMention ? withoutAt : normalizeUrl(item),
      });
    } else {
      const lastToken = tokens[tokens.length - 1];
      
      // if is block token
      if (item.startsWith("`")) (isBlock = true)
      if (isBlock) {
        const trimmed = item.replaceAll("`", "")
        if (lastToken && lastToken.t === "block") {
          tokens[tokens.length - 1].v = lastToken.v + " " + trimmed
        } else {
          tokens.push({
            t: "block",
            v: trimmed
          })
        }
      }

      // If is text token
      if (lastToken && lastToken.t === "text" && !isBlock) {
        tokens[tokens.length - 1].v = lastToken.v + " " + item;
      } else if (!isBlock) {
        tokens.push({
          t: "text",
          v: item,
        });
      }

      // if is block token
      if (item.endsWith("`")) {
        isBlock = false;
      }

    }
  });

  return {
    tokens,
    whisperedTo: roomUsers
      .filter((u) =>
        whisperedToUsernames
          .map((u) => u?.toLowerCase())
          .includes(u.username?.toLowerCase())
      )
      .map((u) => u.id),
  };
};

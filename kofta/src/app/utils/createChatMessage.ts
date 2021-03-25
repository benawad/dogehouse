import { linkRegex, codeBlockRegex } from "./../constants";
import { BaseUser } from "../types";
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

  const testAndPushToken = (item: string) => {
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
    } else if (item.startsWith(":") && item.endsWith(":") && item.length > 2) {
      tokens.push({
        t: "emote",
        v: item.slice(1, item.length - 1),
      });
    } else {
      tokens.push({
        t: "text",
        v: item,
      });
    }
  };

  const whisperedToUsernames: string[] = [];

  const match = message.matchAll(new RegExp(codeBlockRegex, "g"));
  let matchResult = match.next();

  // For message that matches the regex pattern of code blocks.
  if (!matchResult.done) {
    const splitMessage = message.split(codeBlockRegex);

    splitMessage.forEach((text, index) => {
      // First and last index is empty string while split using the code block regex.
      if (!index && index === splitMessage.length - 1) {
        return;
      }

      const trimmed = text.trim();

      if (!matchResult.done && text === matchResult.value[1]) {
        trimmed
          ? tokens.push({
              t: "block",
              v: trimmed,
            })
          : tokens.push({
              t: "text",
              v: matchResult.value[0],
            });
        matchResult = match.next();
      } else {
        text.split(" ").forEach((item) => {
          testAndPushToken(item);
        });
      }
    });
  } else {
    message.split(" ").forEach((item) => {
      testAndPushToken(item);
    });
  }

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

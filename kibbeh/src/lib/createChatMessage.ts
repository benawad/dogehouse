import { BaseUser } from "@dogehouse/kebab";
import normalizeUrl from "normalize-url";
import { linkRegex, codeBlockRegex, mentionRegex } from "./constants";

export const createChatMessage = (
  message: string,
  roomUsers: BaseUser[] = []
) => {
  const tokens = ([] as unknown) as [
    {
      t: string;
      v: string;
    }
  ];

  const whisperedToUsernames: string[] = [];

  const testAndPushToken = (item: string) => {
    const isLink = linkRegex.test(item);
    const withoutAt = item.replace(/@|#/g, "");
    const isMention =
      roomUsers.find((m) => withoutAt === m.username) &&
      mentionRegex.test(item);

    // whisperedTo users list
    if (isMention && item.startsWith("#@")) {
      whisperedToUsernames.push(withoutAt);
    }

    if (isLink) {
      tokens.push({
        t: "link",
        v: normalizeUrl(item),
      });
    } else if (isMention) {
      tokens.push({
        t: "mention",
        v: withoutAt,
      });
    } else if (item.startsWith(":") && item.endsWith(":") && item.length > 2) {
      tokens.push({
        t: "emote",
        v: item.slice(1, item.length - 1).toLowerCase(),
      });
    } else {
      tokens.push({
        t: "text",
        v: item,
      });
    }
  };

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
        if (trimmed) {
          tokens.push({
            t: "block",
            v: trimmed,
          });
        } else {
          tokens.push({
            t: "text",
            v: matchResult.value[0],
          });
        }

        matchResult = match.next();
      } else {
        text.split(" ").forEach((item) => {
          testAndPushToken(item);
        });
      }
    });
  } else {
    message.split(" ").forEach((item) => testAndPushToken(item));
  }

  return {
    tokens,
    whisperedTo: roomUsers
      .filter((u) =>
        whisperedToUsernames
          .map((x) => x?.toLowerCase())
          .includes(u.username?.toLowerCase())
      )
      .map((u) => u.id),
  };
};

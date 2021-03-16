export const customEmojis = [
  {
    name: "monkaS",
    short_names: ["monkaS"],
    text: "",
    emoticons: [],
    keywords: ["monkas", "pepe"],
    imageUrl: "/emotes/monkas.png",
    customCategory: "BetterTTV",
  },
  {
    name: "HYPERS",
    short_names: ["HYPERS"],
    text: "",
    emoticons: [],
    keywords: ["hypers", "pepe"],
    imageUrl: "/emotes/hypers.png",
    customCategory: "BetterTTV",
  },
];

export const emoteMap: Record<string, string> = {};

customEmojis.forEach((e) => {
  emoteMap[e.name] = e.imageUrl;
});

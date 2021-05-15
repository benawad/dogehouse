export const validationRegex = {
	link: /(https?\:\/\/[^ ]+)/gi,
	mention: /\@([a-zA-Z0-9_]{4,})/gi,
	emote: /\:([a-z0-9]+)\:/gi,
	block: /\`(.*?)\`/gi,

	global: /(\`.*?\`)|(\@[a-zA-Z0-9_]{4,})|(\:[a-z0-9]+\:)|(https?\:\/\/[^ ]+)/gi,

	unicodeEmoji:  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])/gm
}

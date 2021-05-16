import { Token } from "../../util/types/tokenTypes";
import emojiRegex from "emoji-regex"

export default {
	name: "emoji",
	regex: emojiRegex(),

	format: (val) => val,
  validate: (raw, val) => true
} as Token;

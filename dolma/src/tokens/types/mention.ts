import { Token } from "../../util/types/tokenTypes";

export default {
	name: "mention",
	regex: /\@([a-zA-Z0-9_]{4,})/gi,

	format: (val) => val,
  validate: (raw, val) => true
} as Token;
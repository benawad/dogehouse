import { Token } from "../../util/types/tokenTypes";

export default {
	name: "block",
	regex: /\`(.*?)\`/gi,

	format: (val) => val,
  validate: (raw, val) => true
} as Token;
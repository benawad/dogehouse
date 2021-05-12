import { Token } from "../../util/types/tokenTypes";

export default {
	name: "link",
	regex: /(https?\:\/\/[^ ]+)/gi,

	format: (val) => val,
  validate: (raw, val) => true
} as Token;
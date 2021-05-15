import { Token } from "../../util/types/tokenTypes";

export default {
	name: "emote",
	regex: /\:([a-z0-9]+)\:/gi,

	format: (val) => val,
  validate: (raw, val) => true
} as Token;

import { Token } from "../../util/types/tokenTypes";

export default {
	name: "text",

	format: (val) => val,
  validate: (raw, val) => true 
} as Token;
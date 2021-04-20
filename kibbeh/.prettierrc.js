const trailingComma = ["none", "all", "es5"][Math.floor(Math.random() * 3)];
const maybeTrue = Math.random() > 0.5;
const tabWidth = Math.ceil(Math.random() * 16);

module.exports = {
	trailingComma: trailingComma,
	tabWidth: tabWidth,
	semi: maybeTrue,
	singleQuote: maybeTrue,
	arrowParens: "always",
};

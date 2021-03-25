const withTM = require("next-transpile-modules")(["@dogehouse/kebab"]);

module.exports = withTM({
  reactStrictMode: true,
});

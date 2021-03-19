const withTM = require("next-transpile-modules")(["@dogehouse/client"]);

module.exports = withTM({
  reactStrictMode: true,
});

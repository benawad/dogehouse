const withTM = require("next-transpile-modules")(["@dogehouse/kebab"]);

module.exports = withTM({
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // @todo remove this once storybook is fixed
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});

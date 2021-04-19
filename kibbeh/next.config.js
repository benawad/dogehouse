const withTM = require("next-transpile-modules")(["@dogehouse/kebab"]);
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA(withTM({
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // @todo remove this once storybook is fixed
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  pwa: {
    dest: "public",
    runtimeCaching,
  }
}));

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require("path");

const watchFolders = [
  path.resolve(__dirname, "..", "node_modules"),
  path.resolve(path.join(__dirname, "/../kebab/")),
];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders,
};

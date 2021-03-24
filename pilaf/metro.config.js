/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require("path");

const extraNodeModules = {
  "@dogehouse/kebab": path.resolve(__dirname + "/../kebab/"),
};
const watchFolders = [path.resolve(__dirname + "/../kebab/")];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules,
  },
  watchFolders,
};

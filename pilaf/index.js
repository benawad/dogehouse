/**
 * @format
 */

import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

import { Config } from "react-native-config";

import App from "./App";
import StorybookUI from "./storybook";

import { configureNotificationCenter } from "./src/lib/notificationCenter";

configureNotificationCenter();

AppRegistry.registerComponent(appName, () =>
  Config.IS_STORYBOOK === "true" ? StorybookUI : App
);

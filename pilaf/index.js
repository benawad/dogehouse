/**
 * @format
 */

import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";

import { Config } from "react-native-config";

import App from "./App";
import StorybookUI from "./storybook";

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import * as RootNavigation from "./src/navigators/RootNavigation";

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    console.log("ACTION:", notification.action);

    if (notification.action === "join") {
      if (notification.data.locale) {
        RootNavigation.navigate("Room", { roomId: notification.data.roomId });
      }
    }

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

PushNotificationIOS.setNotificationCategories([
  {
    id: "room_created",
    actions: [
      { id: "join", title: "Join the room", options: { foreground: true } },
      {
        id: "ignore",
        title: "Ignore",
        options: { foreground: true, destructive: true },
      },
    ],
  },
]);

AppRegistry.registerComponent(appName, () =>
  Config.IS_STORYBOOK === "true" ? StorybookUI : App
);

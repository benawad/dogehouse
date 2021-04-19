import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from "react-native";
import PushNotification, {
  PushNotificationObject,
  PushNotificationPermissions,
} from "react-native-push-notification";
import * as RootNavigation from "../navigation/RootNavigation";

export const configureNotificationCenter = () => {
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
    requestPermissions: false,
  });

  if (Platform.OS === "ios") {
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
  }
};

const pushPermissionSafe = (notification: PushNotificationObject) => {
  PushNotification.checkPermissions(
    (permission: PushNotificationPermissions) => {
      if (permission.alert) {
        PushNotification.localNotification(notification);
      } else {
        PushNotification.requestPermissions()
          .then((value: PushNotificationPermissions) => {
            PushNotification.localNotification(notification);
          })
          .catch((reason: any) => {});
      }
    }
  );
};

export const pushRoomCreateNotification = (
  username: string,
  roomName: string,
  roomId: string
) => {
  pushPermissionSafe({
    id: 0,
    title: username + " created a room",
    message: roomName,
    userInfo: { roomId: roomId, locale: true },
    playSound: false,
    soundName: "default",
    category: "room_created",
  });
};

export const pushRoomInvitationNotification = (
  username: string,
  roomName: string,
  roomId: string
) => {
  pushPermissionSafe({
    id: 0,
    title: username + " invites you",
    message: "Room: " + roomName,
    userInfo: { roomId: roomId, locale: true },
    playSound: false,
    soundName: "default",
    category: "room_created",
  });
};

import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Platform } from "react-native";
import { WaitForWsAndAuth } from "../modules/auth/WaitForWsAndAuth";
import MinimizedRoomCardController from "../modules/room/MinimizedRoomCardController";
import { HelpPage } from "./mainNavigator/HelpPage";
import { LanguagesPage } from "./mainNavigator/LanguagesPage";
import { MainPage } from "./mainNavigator/MainPage";
import { MessagesPage } from "./mainNavigator/MessagesPage";
import { NotificationsPage } from "./mainNavigator/NotificationsPage";
import { ProfilePage } from "./mainNavigator/ProfilePage";
import { ReportBugPage } from "./mainNavigator/ReportBugPage";
import { RoomPage } from "./mainNavigator/RoomPage";
import { SearchPage } from "./mainNavigator/SearchPage";
import { SettingsPage } from "./mainNavigator/SettingsPage";
import { WalletPage } from "./mainNavigator/WalletPage";

export type RootStackParamList = {
  Main: undefined;
  Notifications: undefined;
  Search: undefined;
  Messages: undefined;
  Profile: undefined;
  Settings: undefined;
  Wallet: undefined;
  Language: undefined;
  Help: undefined;
  ReportBug: undefined;
  Room: { roomId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
  return (
    <WaitForWsAndAuth>
      <MinimizedRoomCardController />

      <Stack.Navigator
        mode="card"
        screenOptions={{
          headerShown: false,
          animationEnabled: Platform.OS === "ios",
          // headerStyle: {
          //   backgroundColor: colors.primary900,
          //   borderBottomColor: colors.primary900,
          //   shadowColor: colors.primary900,
          // },
          // headerTitleStyle: {
          //   color: colors.text,
          // },
          // headerTintColor: colors.text,
          // headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Notifications" component={NotificationsPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="Messages" component={MessagesPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
        <Stack.Screen name="Wallet" component={WalletPage} />
        <Stack.Screen name="Language" component={LanguagesPage} />
        <Stack.Screen name="Help" component={HelpPage} />
        <Stack.Screen name="ReportBug" component={ReportBugPage} />
        <Stack.Screen name="Room" component={RoomPage} />
      </Stack.Navigator>
    </WaitForWsAndAuth>
  );
};

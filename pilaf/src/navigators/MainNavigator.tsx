import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { colors } from "../constants/dogeStyle";
import { WebSocketProvider } from "../modules/ws/WebSocketProvider";
import { HelpPage } from "../pages/HelpPage";
import { LanguagePage } from "../pages/LanguagePage";
import { MainPage } from "../pages/MainPage";
import { MessagesPage } from "../pages/MessagesPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ReportBugPage } from "../pages/ReportBugPage";
import { SearchPage } from "../pages/SearchPage";
import { SettingsPage } from "../pages/SettingsPage";
import { WalletPage } from "../pages/WalletPage";

const Stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <WebSocketProvider shouldConnect={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.primary900,
            borderBottomColor: colors.primary900,
            shadowColor: colors.primary900,
          },
          headerTitleStyle: {
            color: colors.text,
          },
          headerTintColor: colors.text,
          headerBackTitleVisible: false,
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
        <Stack.Screen name="Language" component={LanguagePage} />
        <Stack.Screen name="Help" component={HelpPage} />
        <Stack.Screen name="ReportBug" component={ReportBugPage} />
      </Stack.Navigator>
    </WebSocketProvider>
  );
};

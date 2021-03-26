import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image } from "react-native";
import { CreateRoomButton } from "../components/bottomBar/CreateRoomButton";
import { colors } from "../constants/dogeStyle";
import { DashboardPage } from "../pages/DashboardPage";
import { ExplorePage } from "../pages/ExplorePage";
import { FollowingPage } from "../pages/FollowingPage";
import { SchedulePage } from "../pages/SchedulePage";
const Tab = createBottomTabNavigator();

const EmptyComponent: React.FC = () => {
  return null;
};

export const BottomNavigator: React.FC = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon = require("../assets/images/bottomBar/plus.png");
            if (route.name === "Home") {
              icon = require("../assets/images/bottomBar/sm-solid-home.png");
            } else if (route.name === "Schedule") {
              icon = require("../assets/images/bottomBar/ios-calendar.png");
            } else if (route.name === "Following") {
              icon = require("../assets/images/bottomBar/sm-solid-friends.png");
            } else if (route.name === "Explore") {
              icon = require("../assets/images/bottomBar/ios-compass.png");
            }
            const tintColor = focused ? colors.accent : colors.text;
            return <Image source={icon} style={{ tintColor: tintColor }} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: colors.accent,
          inactiveTintColor: colors.text,
          activeBackgroundColor: colors.primary900,
          inactiveBackgroundColor: colors.primary900,
          style: {
            backgroundColor: colors.primary900,
            borderTopColor: colors.primary900,
          },
          showLabel: false,
        }}
      >
        <Tab.Screen name="Home" component={DashboardPage} />
        <Tab.Screen name="Schedule" component={SchedulePage} />
        <Tab.Screen
          name="Create"
          component={EmptyComponent}
          options={{ tabBarButton: (props) => <CreateRoomButton {...props} /> }}
        />
        <Tab.Screen name="Explore" component={ExplorePage} />
        <Tab.Screen name="Following" component={FollowingPage} />
      </Tab.Navigator>
    </>
  );
};

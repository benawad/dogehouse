import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { FollowingPage } from "../pages/FollowingPage";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";
import { SchedulePage } from "../pages/SchedulePage";

const Tab = createBottomTabNavigator();

export const BottomNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Schedule" component={SchedulePage} />
      <Tab.Screen name="Following" component={FollowingPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
};

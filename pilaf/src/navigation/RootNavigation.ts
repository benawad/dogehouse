import {
  NavigationContainerRef,
  ParamListBase,
  RouteProp,
  StackActions,
} from "@react-navigation/native";
import * as React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

// This allow to get route and navigation props

export interface StackNavigationProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> {
  navigation: StackNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
}

// This allow to call navigation from outside a Navigator. Usefull for floating RoomController

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name, params = {}) {
  navigationRef.current?.dispatch(StackActions.popToTop());
  navigationRef.current?.navigate(name, params);
}

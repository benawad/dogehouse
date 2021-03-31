import { NavigationContainerRef, StackActions } from "@react-navigation/native";
import * as React from "react";

// This allow to call navigation from outside a Navigator. Usefull for floating RoomController

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name, params) {
  navigationRef.current?.dispatch(StackActions.popToTop());
  navigationRef.current?.navigate(name, params);
}

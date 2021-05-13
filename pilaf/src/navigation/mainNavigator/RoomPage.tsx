import React from "react";
import { RoomController } from "../../modules/room/RoomController";
import { RootStackParamList } from "../MainNavigator";
import { StackNavigationProps } from "../RootNavigation";

export const RoomPage: React.FC<
  StackNavigationProps<RootStackParamList, "Room">
> = ({ route }) => {
  return <RoomController roomId={route.params.roomId} />;
};

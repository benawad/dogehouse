import { RouteProp } from "@react-navigation/native";
import React from "react";
import { RoomController } from "../../modules/room/RoomController";
import { RootStackParamList } from "../MainNavigator";

type RoomPageRouteProp = RouteProp<RootStackParamList, "Room">;

type RoomPageProps = {
  route: RoomPageRouteProp;
};

export const RoomPage: React.FC<RoomPageProps> = ({ route }) => {
  return <RoomController roomId={route.params.roomId} />;
};

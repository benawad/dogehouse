import { RouteProp } from "@react-navigation/native";
import React from "react";
import { InviteRoomController } from "../../modules/room/InviteRoomController";
import { RoomStackParamList } from "./RoomNavigator";

type RoomPageRouteProp = RouteProp<RoomStackParamList, "RoomInvitation">;

type InviteRoomPageProps = {
  route: RoomPageRouteProp;
};

export const InviteRoomPage: React.FC<InviteRoomPageProps> = ({ route }) => {
  return <InviteRoomController room={route.params.room} />;
};

import { RouteProp } from "@react-navigation/native";
import React from "react";
import { RoomDescriptionController } from "../../modules/room/RoomDescriptionController";
import { RoomStackParamList } from "./RoomNavigator";

type RoomDescriptionPageRouteProp = RouteProp<
  RoomStackParamList,
  "RoomDescription"
>;

type RoomDescriptionPageProps = {
  route: RoomDescriptionPageRouteProp;
};

export const RoomDescriptionPage: React.FC<RoomDescriptionPageProps> = ({
  route,
}) => {
  return <RoomDescriptionController data={route.params.data} />;
};

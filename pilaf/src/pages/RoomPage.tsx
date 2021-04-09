import { RouteProp } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TitledHeader } from "../components/header/TitledHeader";
import { colors } from "../constants/dogeStyle";
import { WaitForWsAndAuth } from "../modules/auth/WaitForWsAndAuth";
import { RoomPanelController } from "../modules/room/RoomPanelController";
import { RootStackParamList } from "../navigators/MainNavigator";

type RoomPageRouteProp = RouteProp<RootStackParamList, "Room">;

type RoomPageProps = {
  route: RoomPageRouteProp;
};

export const RoomPage: React.FC<RoomPageProps> = ({ route }) => {
  return (
    <WaitForWsAndAuth>
      <RoomPanelController roomId={route.params.roomId} />
    </WaitForWsAndAuth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});

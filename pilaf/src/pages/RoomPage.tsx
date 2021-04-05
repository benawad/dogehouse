import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { TitledHeader } from "../components/header/TitledHeader";
import { colors } from "../constants/dogeStyle";
import { WaitForWsAndAuth } from "../modules/auth/WaitForWsAndAuth";
import { RoomPanelController } from "../modules/room/RoomPanelController";
import { useOnRoomPage } from "../modules/room/useOnRoomPage";
import { UserPreviewModalProvider } from "../modules/room/UserPreviewModalProvider";
import { RootStackParamList } from "../navigators/MainNavigator";

type RoomPageRouteProp = RouteProp<RootStackParamList, "Room">;

type RoomPageProps = {
  route: RoomPageRouteProp;
};

export const RoomPage: React.FC<RoomPageProps> = ({ route }) => {
  const { setOnRoomPage } = useOnRoomPage();
  useFocusEffect(
    useCallback(() => {
      setOnRoomPage(true);
      return () => {
        setOnRoomPage(false);
      };
    }, [])
  );
  return (
    <WaitForWsAndAuth>
      <UserPreviewModalProvider>
        <RoomPanelController roomId={route.params.roomId} />
      </UserPreviewModalProvider>
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

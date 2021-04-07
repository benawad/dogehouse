import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TitledHeader } from "../components/header/TitledHeader";
import { colors } from "../constants/dogeStyle";
import { WaitForWsAndAuth } from "../modules/auth/WaitForWsAndAuth";
import { RoomPanelController } from "../modules/room/RoomPanelController";
import { useOnRoomPage } from "../modules/room/useOnRoomPage";
import { UserPreviewModalProvider } from "../modules/room/UserPreviewModalProvider";
import { RootStackParamList } from "../navigators/MainNavigator";
import { RoomNavigator } from "../navigators/RoomNavigator";
import BottomSheet from "reanimated-bottom-sheet";
import { RoomChat } from "../modules/room/chat/RoomChat";
import { useTypeSafeQuery } from "../shared-hooks/useTypeSafeQuery";
import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { validate as uuidValidate } from "uuid";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { Spinner } from "../components/Spinner";
import { useWrappedConn } from "../shared-hooks/useConn";

type RoomPageRouteProp = RouteProp<RootStackParamList, "Room">;

type RoomPageProps = {
  route: RoomPageRouteProp;
};

const placeHolder = (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.primary900,
    }}
  >
    <TitledHeader title={""} showBackButton={true} />
    <Spinner size={"m"} />
  </View>
);

export const RoomPage: React.FC<RoomPageProps> = ({ route }) => {
  const conn = useWrappedConn();
  const roomId = route.params.roomId;
  const { setOnRoomPage } = useOnRoomPage();
  const { currentRoomId, setCurrentRoomId } = useCurrentRoomIdStore();
  const navigation = useNavigation();
  const sheetRef = useRef(null);
  const inset = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      setOnRoomPage(true);
      return () => {
        setOnRoomPage(false);
      };
    }, [])
  );
  const { data, isLoading } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", roomId || ""],
    {
      enabled: uuidValidate(roomId),
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (!("error" in d)) {
          setCurrentRoomId(() => d.room.id);
        }
      }) as any,
    },
    [roomId]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!data) {
      setCurrentRoomId(null);
      navigation.navigate("Home");
      return;
    }
    if ("error" in data) {
      setCurrentRoomId(null);
      //showErrorToast(data.error);
      navigation.navigate("Home");
    }
  }, [data, isLoading, navigation.navigate, setCurrentRoomId]);

  if (isLoading || !currentRoomId) {
    return placeHolder;
  }

  if (!data || "error" in data) {
    return null;
  }

  const renderChat = () => <RoomChat {...data} style={{ height: "100%" }} />;
  return (
    <WaitForWsAndAuth>
      <UserPreviewModalProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary900,
            paddingBottom: 79 + inset.bottom,
          }}
        >
          <RoomNavigator data={data} />
        </View>
        <BottomSheet
          ref={sheetRef}
          snapPoints={["95%", 79 + inset.bottom + 20]}
          initialSnap={1}
          borderRadius={20}
          renderContent={renderChat}
        />
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

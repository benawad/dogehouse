import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "reanimated-bottom-sheet";
import { validate as uuidValidate } from "uuid";
import { TitledHeader } from "../../components/header/TitledHeader";
import { Spinner } from "../../components/Spinner";
import { colors } from "../../constants/dogeStyle";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { RoomNavigator } from "../../navigation/mainNavigator/RoomNavigator";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { RoomChat } from "./chat/RoomChat";
import { useOnRoomPage } from "./useOnRoomPage";

const placeHolder = (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.primary900,
    }}
  >
    <TitledHeader title={""} showBackButton={true} />
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinner size={"m"} />
    </View>
  </View>
);

export type RoomControllerProps = {
  roomId: string;
};

export const RoomController: React.FC<RoomControllerProps> = ({ roomId }) => {
  // const conn = useWrappedConn();
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
    }, [setOnRoomPage])
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
  }, [data, isLoading, navigation, navigation.navigate, setCurrentRoomId]);

  if (isLoading || !currentRoomId) {
    return placeHolder;
  }

  if (!data || "error" in data) {
    return null;
  }

  const renderChat = () => (
    <RoomChat {...data} wrapperRef={sheetRef} style={{ height: "100%" }} />
  );
  return (
    <WaitForWsAndAuth>
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
    </WaitForWsAndAuth>
  );
};

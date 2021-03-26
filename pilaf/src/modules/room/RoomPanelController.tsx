import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
// import { ErrorToast } from "../../ui/ErrorToast";
import Toast from "react-native-toast-message";
import { TitledHeader } from "../../components/header/TitledHeader";
import { colors, h4, paragraph } from "../../constants/dogeStyle";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { isUuid } from "../../lib/isUuid";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";

interface RoomPanelControllerProps {
  roomId?: string | undefined;
}

const placeHolder = (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.primary900,
    }}
  >
    <TitledHeader title={""} showBackButton={true} />
    <ActivityIndicator color={colors.text} />
  </View>
);

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({
  roomId,
}) => {
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoom?.id || ""],
    {
      refetchOnMount: "always",
      enabled: isUuid(roomId),
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (!("error" in d)) {
          setCurrentRoom(() => d.room);
        }
      }) as any,
    },
    [roomId]
  );
  if (!data) {
    // @todo add error handling
    console.log("return firsst");
    return placeHolder;
  }

  // @todo start using error codes
  if ("error" in data) {
    // @todo replace with real design
    useEffect(() => {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }, []);
    return <View />;
  }

  if (!currentRoom) {
    // return null;
    return placeHolder;
  }

  if (currentRoom.id !== roomId) {
    return placeHolder;
  }

  const roomCreator = data?.users.find((x) => x.id === currentRoom.creatorId);
  //return placeHolder;
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary900 }}>
      <TitledHeader title={currentRoom.name} showBackButton={true} />
      <Text style={{ ...paragraph }}>{currentRoom.description}</Text>
      <Text style={{ ...paragraph }}>{roomCreator.username}</Text>
      <Text style={{ ...paragraph }}>Waiting for design information</Text>
      <Text style={{ ...paragraph }}>{roomId}</Text>
    </View>
  );
};

import React from "react";
import { StyleProp, StyleSheet, ViewStyle, View } from "react-native";
import { colors } from "../../constants/dogeStyle";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { BoxedIcon } from "./BoxedIcon";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import * as RootNavigation from "../../navigators/RootNavigation";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useOnRoomPage } from "../../modules/room/useOnRoomPage";
interface RoomControllerProps {
  style?: StyleProp<ViewStyle>;
}

export const RoomController: React.FC<RoomControllerProps> = ({ style }) => {
  const setInternalMute = useSetMute();
  const muted = useMuteStore((s) => s.muted);
  const { currentRoomId } = useCurrentRoomIdStore();
  const { onRoomPage } = useOnRoomPage();

  if (!onRoomPage && currentRoomId) {
    return (
      <View style={[styles.container, style]}>
        <BoxedIcon
          image={require("../../assets/images/bxs-microphone.png")}
          imageColor={muted ? colors.text : colors.accent}
          onPress={() => setInternalMute(!muted)}
        />
        {/* <BoxedIcon
          image={require("../../assets/images/ios-volume-low.png")}
          onPress={() => console.log("volume")}
        /> */}
        <BoxedIcon
          image={require("../../assets/images/bxs-maximize.png")}
          onPress={() =>
            RootNavigation.navigate("Room", { roomId: currentRoomId })
          }
        />
      </View>
    );
  }
  return <></>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 100,
    height: 50,
    backgroundColor: colors.primary900,
  },
});

import React from "react";
import { StyleProp, StyleSheet, ViewStyle, Text, View } from "react-native";
import { colors, paragraph, radius } from "../../constants/dogeStyle";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { BoxedIcon } from "./BoxedIcon";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import * as RootNavigation from "../../navigators/RootNavigation";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useOnRoomPage } from "../../modules/room/useOnRoomPage";
import { MultipleUserAvatar } from "../avatars/MultipleUserAvatar";
import { TouchableOpacity } from "react-native-gesture-handler";
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
        <TouchableOpacity
          style={styles.roomInfo}
          containerStyle={{ flex: 1 }}
          onPress={() =>
            RootNavigation.navigate("Room", { roomId: currentRoomId })
          }
        >
          <MultipleUserAvatar
            size="xs"
            srcArray={[
              require("../../assets/images/100.png"),
              require("../../assets/images/100.png"),
            ]}
          />
          <Text
            style={{ ...paragraph, marginHorizontal: 10, flex: 1 }}
            numberOfLines={1}
          >
            Starting your dream businessfdafdfadfadsfafdafadfa
          </Text>
        </TouchableOpacity>
        <BoxedIcon
          image={require("../../assets/images/bxs-microphone.png")}
          imageColor={muted ? colors.text : colors.accent}
          onPress={() => setInternalMute(!muted)}
          style={{ width: 60 }}
        />
        {/* <BoxedIcon
          image={require("../../assets/images/bxs-maximize.png")}
          onPress={() =>
            RootNavigation.navigate("Room", { roomId: currentRoomId })
          }
        /> */}
      </View>
    );
  }
  return <></>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.primary800,
    borderColor: colors.accent,
    borderRadius: radius.m,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    width: 295,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
});

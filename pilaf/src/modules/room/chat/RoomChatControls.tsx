import { Room } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius } from "../../../constants/dogeStyle";
import { useMuteStore } from "../../../global-stores/useMuteStore";
import { useSetMute } from "../../../shared-hooks/useSetMute";

interface RoomChatControlsProps {
  room: Room;
}

export const RoomChatControls: React.FC<RoomChatControlsProps> = ({ room }) => {
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: colors.primary800,
        paddingBottom: inset.bottom + 20,
      }}
    >
      <View style={styles.toggle} />
      <View style={[styles.controlsContainer]}>
        <TouchableOpacity
          style={styles.micControl}
          onPress={() => setMute(!muted)}
        >
          <Image
            source={
              muted
                ? require("../../../assets/images/SolidMicrophoneOff.png")
                : require("../../../assets/images/bxs-microphone.png")
            }
            style={{ tintColor: colors.text, height: 16, width: 16 }}
          />
        </TouchableOpacity>
        <View style={{ flexGrow: 1 }} />
        {/* <TouchableOpacity style={styles.soundControl}>
          <Image
            source={require("../../../assets/images/ios-volume-low.png")}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.inviteControl}
          onPress={() => navigation.navigate("RoomInvitation", { room: room })}
        >
          <Image source={require("../../../assets/images/md-person-add.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary300,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 25,
  },
  micControl: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary700,
    borderRadius: radius.m,
    height: 50,
    width: 80,
  },
  soundControl: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary700,
    borderRadius: 25,
    marginRight: 15,
  },
  inviteControl: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary700,
    borderRadius: 25,
    paddingRight: 2.5,
  },
});

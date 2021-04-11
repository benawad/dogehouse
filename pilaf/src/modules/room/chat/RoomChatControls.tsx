import { Room, wrap } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius } from "../../../constants/dogeStyle";
import { useMuteStore } from "../../../global-stores/useMuteStore";
import { InCallManagerSetSpeakerOn } from "../../../lib/inCallManagerCenter";
import { useConn } from "../../../shared-hooks/useConn";
import { useSetMute } from "../../../shared-hooks/useSetMute";

interface RoomChatControlsProps {
  room: Room;
  amISpeaker: boolean;
  amIAskingForSpeak: boolean;
}

const micOff = require("../../../assets/images/SolidMicrophoneOff.png");
const micOn = require("../../../assets/images/sm-solid-microphone.png");
const askSpeak = require("../../../assets/images/sm-solid-megaphone.png");
const volumeHigh = require("../../../assets/images/ios-volume-high.png");
const invite = require("../../../assets/images/md-person-add.png");

export const RoomChatControls: React.FC<RoomChatControlsProps> = ({
  room,
  amISpeaker,
  amIAskingForSpeak,
}) => {
  const conn = useConn();
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [speakerOn, setSpeakerOn] = useState(false);
  InCallManagerSetSpeakerOn(speakerOn);

  let onPress;
  if (amISpeaker) {
    onPress = () => setMute(!muted);
  } else {
    if (amIAskingForSpeak) {
      onPress = () => {};
    } else {
      onPress = () => wrap(conn).mutation.askToSpeak();
    }
  }

  return (
    <View
      style={{
        backgroundColor: colors.primary800,
        paddingBottom: inset.bottom + 20,
      }}
    >
      <View style={styles.toggle} />
      <View style={[styles.controlsContainer]}>
        <TouchableOpacity style={styles.micControl} onPress={onPress}>
          {amISpeaker && (
            <Image
              source={muted ? micOff : micOn}
              style={{ tintColor: colors.text, width: 20, height: 20 }}
            />
          )}
          {!amISpeaker && (
            <Image
              source={askSpeak}
              style={{
                tintColor: colors.text,
                width: 20,
                height: 20,
              }}
            />
          )}
        </TouchableOpacity>
        <View style={{ flexGrow: 1 }} />
        <TouchableOpacity
          style={[
            styles.soundControl,
            speakerOn && { backgroundColor: colors.primary600 },
          ]}
          onPress={() => setSpeakerOn(!speakerOn)}
        >
          <Image
            source={volumeHigh}
            style={{ tintColor: colors.text, width: 20, height: 17.5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inviteControl}
          onPress={() => navigation.navigate("RoomInvitation", { room: room })}
        >
          <Image source={invite} style={{ width: 20, height: 16 }} />
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

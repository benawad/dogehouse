import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, h4 } from "../../constants/dogeStyle";
import { IconButton } from "../buttons/IconButton";
import { HeaderBase } from "./HeaderBase";

type RoomHeaderProps = {
  showBackButton: boolean;
  onLeavePress: () => void;
  onMutePress: () => void;
  onSpeakPress: () => void;
  muted: boolean;
  canAskToSpeak: boolean;
};

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  showBackButton = true,
  onLeavePress,
  onMutePress,
  onSpeakPress,
  muted,
  canAskToSpeak,
}) => {
  return (
    <HeaderBase showBackButton={showBackButton}>
      <View style={styles.rightContainer}>
        {canAskToSpeak && (
          <IconButton
            icon={require("../../assets/images/sm-solid-megaphone.png")}
            style={{ marginLeft: 30 }}
            onPress={onSpeakPress}
          />
        )}
        <IconButton
          icon={require("../../assets/images/bxs-microphone.png")}
          style={{ marginLeft: 30 }}
          iconColor={muted ? colors.text : colors.accent}
          onPress={onMutePress}
        />
        <IconButton
          icon={require("../../assets/images/dogecoin.png")}
          style={{ marginLeft: 30 }}
          onPress={onLeavePress}
        />
      </View>
    </HeaderBase>
  );
};

const styles = StyleSheet.create({
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginHorizontal: 20,
  },
});

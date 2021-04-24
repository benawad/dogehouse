import React from "react";
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors, paragraph, radius } from "../../constants/dogeStyle";
import { MultipleUserAvatar } from "../avatars/MultipleUserAvatar";
import { BoxedIcon } from "./BoxedIcon";

interface MinimizedRoomCardProps {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  room: {
    name: string;
    speakerAvatars: ImageSourcePropType[];
    speakers?: string[];
    roomStartedAt: Date;
    myself: {
      isSpeaker?: boolean;
      isMuted: boolean;
      isDeafened?: boolean;
      switchMuted(): void;
      switchDeafened?: () => void;
      leave?: () => void;
    };
  };
}

export const MinimizedRoomCard: React.FC<MinimizedRoomCardProps> = ({
  style,
  room,
  onPress,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.roomInfo}
        containerStyle={{ flex: 1 }}
        onPress={onPress}
      >
        {room.speakerAvatars.length > 0 && (
          <MultipleUserAvatar size="xs" srcArray={room.speakerAvatars} />
        )}
        <Text
          style={{ ...paragraph, marginHorizontal: 10, flex: 1 }}
          numberOfLines={1}
        >
          {room.name}
        </Text>
      </TouchableOpacity>
      <BoxedIcon
        image={
          room.myself.isMuted
            ? require("../../assets/images/SolidMicrophoneOff.png")
            : require("../../assets/images/bxs-microphone.png")
        }
        imageColor={colors.text}
        onPress={() => room.myself.switchMuted()}
        style={{ width: 60, margin: 10 }}
      />
    </View>
  );
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
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    width: 295,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});

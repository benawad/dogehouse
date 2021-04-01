import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors, small } from "../../constants/dogeStyle";
import { SingleUserAvatar } from "./SingleUserAvatar";

interface RoomAvatarProps {
  style?: StyleProp<ViewStyle>;
  src: ImageSourcePropType;
  username: string;
  flair?: React.ReactNode;
  muted?: boolean;
  activeSpeaker?: boolean;
  onPress?: () => void;
}

export const RoomAvatar: React.FC<RoomAvatarProps> = ({
  src,
  username,
  style,
  flair,
  muted,
  activeSpeaker,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[style, { alignItems: "center" }]}
      onPress={onPress}
    >
      <SingleUserAvatar
        src={src}
        size={"md"}
        muted={muted}
        activeSpeaker={activeSpeaker}
      />
      <Text
        style={{ ...small, width: 80, textAlign: "center" }}
        numberOfLines={1}
      >
        {username}
        {flair}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../constants/dogeStyle";

interface SingleUserAvatarProps {
  style?: StyleProp<ViewStyle>;
  src: ImageSourcePropType;
  size?: "default" | "sm" | "m" | "xs";
  isOnline?: boolean;
}

export const singleUserAvatarSize = {
  default: 80,
  sm: 40,
  m: 30,
  xs: 20,
};

export const SingleUserAvatar: React.FC<SingleUserAvatarProps> = ({
  src,
  size = "default",
  style,
  isOnline = false,
}) => {
  return (
    <View style={[style, styles[size + "Avatar"]]}>
      <Image source={src} style={styles[size + "Avatar"]} />
      {isOnline && (
        <View style={[styles[size + "Indicator"], styles.indicator]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultAvatar: {
    height: singleUserAvatarSize.default,
    width: singleUserAvatarSize.default,
    borderRadius: singleUserAvatarSize.default / 2,
  },
  smAvatar: {
    height: singleUserAvatarSize.sm,
    width: singleUserAvatarSize.sm,
    borderRadius: singleUserAvatarSize.sm / 2,
  },
  mAvatar: {
    height: singleUserAvatarSize.m,
    width: singleUserAvatarSize.m,
    borderRadius: singleUserAvatarSize.m / 2,
  },
  xsAvatar: {
    height: singleUserAvatarSize.xs,
    width: singleUserAvatarSize.xs,
    borderRadius: singleUserAvatarSize.xs / 2,
  },
  indicator: {
    position: "absolute",
    borderColor: colors.primary900,
    backgroundColor: colors.accent,
  },
  defaultIndicator: {
    width: 24,
    height: 24,
    right: 2,
    bottom: -4,
    borderWidth: 4,
    borderRadius: 12,
  },
  mIndicator: {
    width: 8,
    height: 8,
    top: 23,
    left: 20,
    borderWidth: 1,
    borderRadius: 4,
  },
  smIndicator: {
    width: 12,
    height: 12,
    top: 29,
    left: 29,
    borderWidth: 2,
    borderRadius: 6,
  },
  xsIndicator: {
    width: 6,
    height: 6,
    right: 0,
    bottom: -1,
    borderWidth: 1,
    borderRadius: 3,
  },
});

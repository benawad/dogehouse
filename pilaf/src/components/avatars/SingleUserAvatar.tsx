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
  size?: "default" | "sm" | "xxs" | "xs" | "md";
  isOnline?: boolean;
  muted?: boolean;
}

export const singleUserAvatarSize = {
  default: 80,
  md: 50,
  sm: 40,
  xxs: 30,
  xs: 20,
};

const indicatorSize = {
  default: 23,
  md: 14,
  sm: 12,
  xxs: 8,
  xs: 6,
};

export const SingleUserAvatar: React.FC<SingleUserAvatarProps> = ({
  src,
  size = "default",
  style,
  isOnline = false,
  muted = false,
}) => {
  return (
    <View style={[style, styles[size + "Avatar"]]}>
      <Image source={src} style={styles[size + "Avatar"]} />
      {isOnline && (
        <View style={[styles[size + "Indicator"], styles.indicator]} />
      )}
      {muted && (
        <View
          style={[
            styles[size + "Indicator"],
            styles.indicator,
            {
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary900,
              height: indicatorSize[size] + 4,
              width: indicatorSize[size] + 4,
              borderRadius: (indicatorSize[size] + 4) / 2,
              padding: 2,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/bxs-microphone.png")}
            style={{
              height: indicatorSize[size] - 4,
              width: indicatorSize[size] - 4,
              tintColor: colors.accent,
            }}
          />
        </View>
        // <View style={[styles[size + "Indicator"]]}>

        // </View>
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
  mdAvatar: {
    height: singleUserAvatarSize.md,
    width: singleUserAvatarSize.md,
    borderRadius: singleUserAvatarSize.md / 2,
  },
  smAvatar: {
    height: singleUserAvatarSize.sm,
    width: singleUserAvatarSize.sm,
    borderRadius: singleUserAvatarSize.sm / 2,
  },
  xxsAvatar: {
    height: singleUserAvatarSize.xxs,
    width: singleUserAvatarSize.xxs,
    borderRadius: singleUserAvatarSize.xxs / 2,
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
  xxsIndicator: {
    width: 8,
    height: 8,
    right: 1,
    bottom: -1,
    borderWidth: 1,
    borderRadius: 4,
  },
  mdIndicator: {
    width: 14,
    height: 14,
    right: 2,
    bottom: -2,
    borderWidth: 2,
    borderRadius: 7,
  },
  smIndicator: {
    width: 12,
    height: 12,
    right: 2,
    bottom: -2,
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
  mdMic: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    right: 2,
    bottom: -2,
    backgroundColor: colors.primary900,
    borderRadius: 9,
  },
});

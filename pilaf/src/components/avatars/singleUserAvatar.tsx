import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from "react-native";
import { colors } from "../../constants/GlobalStyles";

interface SingleUserAvatarProps {
  style?: StyleProp<ViewStyle>;
  src: ImageSourcePropType;
  size: "default" | "sm" | "xs";
  isOnline: boolean;
}

export const SingleUserAvatar: React.FC<SingleUserAvatarProps> = ({
  src,
  size = "default",
  style,
  isOnline = false,
}) => {
  return (
    <View style={styles[size + "Avatar"]}>
      <Image source={src} style={styles[size + "Avatar"]} />
      <View
        style={[
          styles[size + "Indicator"],
          styles.indicator,
          { backgroundColor: isOnline ? "green" : colors.accent },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  defaultAvatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  smAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  xsAvatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  indicator: {
    position: "absolute",
    borderColor: colors.primary900,
  },
  defaultIndicator: {
    width: 24,
    height: 24,
    right: 2,
    bottom: -4,
    borderWidth: 4,
    borderRadius: 12,
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
});

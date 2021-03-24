import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from "react-native";
import { colors } from "../../constants/dogeStyle";
import { SingleUserAvatar, singleUserAvatarSize } from "./SingleUserAvatar";

interface MultipleUserAvatarProps {
  style?: StyleProp<ViewStyle>;
  srcArray: ImageSourcePropType[];
  size?: "default" | "sm" | "xs";
}

export const MultipleUserAvatar: React.FC<MultipleUserAvatarProps> = ({
  srcArray,
  style,
  size = "sm",
}) => {
  const singleAvatarSize = singleUserAvatarSize[size];
  return (
    <View
      style={[
        style,
        {
          width: ((srcArray.length + 1) * singleAvatarSize) / 2 + 4,
          height: singleAvatarSize + 4,
        },
      ]}
    >
      {srcArray.slice(0, 3).map((src, i) => {
        return (
          <View
            key={"" + src + i}
            style={[
              styles.singleAvatarContainer,
              {
                left: (i * singleAvatarSize) / 2,
                borderRadius: (singleAvatarSize + 4) / 2,
                zIndex: -i,
              },
            ]}
          >
            <SingleUserAvatar src={src} size={size} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  singleAvatarContainer: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.primary900,
  },
});

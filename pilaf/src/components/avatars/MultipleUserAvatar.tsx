import React from "react";
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../constants/dogeStyle";
import { SingleUserAvatar, singleUserAvatarSize } from "./SingleUserAvatar";

interface MultipleUserAvatarProps {
  style?: StyleProp<ViewStyle>;
  srcArray: ImageSourcePropType[];
  size?: "default" | "md" | "sm" | "xs";
  translationRatio?: number;
}

export const MultipleUserAvatar: React.FC<MultipleUserAvatarProps> = ({
  srcArray,
  style,
  size = "sm",
  translationRatio = 2,
}) => {
  const singleAvatarSize = singleUserAvatarSize[size];
  return (
    <View
      style={[
        style,
        {
          width:
            ((srcArray.length + 1) * singleAvatarSize) / translationRatio + 4,
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
                left: (i * singleAvatarSize) / translationRatio,
                borderRadius: (singleAvatarSize + 4) / 2,
                zIndex: 100 - i,
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

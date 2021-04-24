import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors, radius } from "../../constants/dogeStyle";

interface BoxedIconProps {
  style?: StyleProp<ViewStyle>;
  image: ImageSourcePropType;
  imageColor?: string;
  onPress: () => void;
}

export const BoxedIcon: React.FC<BoxedIconProps> = ({
  style,
  image,
  imageColor = colors.text,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image source={image} style={{ tintColor: imageColor }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: colors.primary700,
    borderRadius: radius.m,
  },
});

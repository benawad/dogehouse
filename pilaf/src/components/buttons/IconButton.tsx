import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../../constants/dogeStyle";

interface IconButtonProps {
  style?: StyleProp<ViewStyle>;
  icon: ImageSourcePropType;
  iconColor?: string;
  onPress: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
  style,
  onPress,
  icon,
  iconColor = colors.text,
}) => {
  return (
    <TouchableOpacity style={[style, styles.container]} onPress={onPress}>
      <Image source={icon} style={{ tintColor: iconColor }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary900,
  },
});

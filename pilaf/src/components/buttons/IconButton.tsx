import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from "react-native";
import { colors } from "../../constants/dogeStyle";

interface IconButtonProps {
  style?: StyleProp<ViewStyle>;
  icon: ImageSourcePropType;
  onPress: () => void;
}

export const IconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <TouchableOpacity
      style={[props.style, styles.container]}
      onPress={props.onPress}
    >
      <Image source={props.icon} />
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

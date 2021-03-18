import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../../constants/dogeStyle";
import Icon from "react-native-vector-icons/Ionicons";

interface IconButtonProps {
  style?: StyleProp<ViewStyle>;
  iconName: string;
  iconSize: number;
  iconColor: string;
  onPress: () => void;
}

export const IconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <TouchableOpacity
      style={[props.style, styles.container]}
      onPress={props.onPress}
    >
      <Icon
        name={props.iconName}
        size={props.iconSize}
        color={props.iconColor}
      />
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

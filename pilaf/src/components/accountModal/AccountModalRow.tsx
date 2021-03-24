import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { paragraph } from "../../constants/dogeStyle";

export interface AccountModalRowProps {
  icon: ImageSourcePropType;
  title: string;
  onPress: () => void;
}

export const AccountModalRow: React.FC<AccountModalRowProps> = ({
  icon,
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.content}>
      <Image source={icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  title: {
    ...paragraph,
    marginLeft: 16,
  },
});

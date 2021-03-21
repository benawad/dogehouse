import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily, fontSize } from "../../constants/dogeStyle";
import { CreateRoomPage } from "../../pages/CreateRoomPage";

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
    fontSize: fontSize.paragraph,
    color: colors.text,
    fontFamily: fontFamily.regular,
    marginLeft: 16,
  },
  contentView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  buttonStyle: {
    height: 80,
    width: 80,
    borderRadius: 100,
    alignItems: "center",
  },
});

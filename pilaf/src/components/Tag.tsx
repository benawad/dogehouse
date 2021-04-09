import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius } from "../constants/dogeStyle";

interface TagProps {
  style?: ViewStyle;
  glow?: boolean;
}

export const Tag: React.FC<TagProps> = ({ style, children, glow }) => {
  return (
    <View style={[styles.container, glow && styles.glow, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexGrow: 0,
    backgroundColor: colors.primary600,
    borderRadius: radius.s,
    paddingHorizontal: 10,
    // height: 21,
    borderWidth: 0.5,
    borderColor: colors.primary600,
    alignItems: "center",
  },
  glow: {
    borderWidth: 0.5,
    borderColor: colors.accent,
  },
});

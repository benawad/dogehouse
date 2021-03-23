import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius } from "../constants/dogeStyle";

interface TagProps {
  style?: ViewStyle;
  glow?: boolean;
}

export const Tag: React.FC<TagProps> = ({ style, children, glow }) => {
  return (
    <View style={[style, styles.container, glow && styles.glow]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "baseline",
    flexDirection: "row",
    flexGrow: 0,
    backgroundColor: colors.primary700,
    borderRadius: radius.s,
    paddingHorizontal: 10,
  },
  glow: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
});

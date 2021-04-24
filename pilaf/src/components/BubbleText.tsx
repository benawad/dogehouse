import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../constants/dogeStyle";

export interface BubbleTextProps {
  style?: ViewStyle;
  live?: boolean;
  children: React.ReactNode;
}

export const BubbleText: React.FC<BubbleTextProps> = ({
  live,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.liveDot,
          live
            ? { backgroundColor: colors.accent }
            : { backgroundColor: colors.primary300 },
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginRight: 4,
  },
});

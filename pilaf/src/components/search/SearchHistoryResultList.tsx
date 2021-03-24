import React from "react";
import { ScrollView, StyleSheet, View, ViewProps, Text } from "react-native";
import { colors, h4, radius } from "../../constants/dogeStyle";

export const SearchHistoryResultList: React.FC<ViewProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={{ ...h4 }}>Recent</Text>
      <ScrollView style={{ marginTop: 10 }}>{children}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary900,
    borderRadius: radius.m,
  },
});

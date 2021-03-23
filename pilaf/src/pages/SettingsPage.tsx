import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { TitledHeader } from "../components/header/TitledHeader";
import { colors, fontFamily } from "../constants/dogeStyle";
import { useTokenStore } from "../modules/auth/useTokenStore";

export const SettingsPage: React.FC = () => {
  return (
    <>
      <TitledHeader title={"Settings"} showBackButton={true} />
      <View style={styles.container}></View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});

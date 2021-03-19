import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily } from "../constants/dogeStyle";

export const FollowingPage: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: fontFamily.extraBold,
          color: colors.text,
        }}
      >
        Following Page
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});

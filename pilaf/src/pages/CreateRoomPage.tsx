import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily } from "../constants/dogeStyle";

export const CreateRoomPage: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: fontFamily.extraBold,
          color: colors.text,
        }}
      >
        Create Room Page
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    height: 500,
    padding: 16,
    justifyContent: "center",
    backgroundColor: colors.primary800,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
  },
});

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/dogeStyle";
import { CreateRoomPage } from "../../pages/CreateRoomPage";
import { AccountModalRow } from "./AccountModalRow";

const separator = (
  <View style={{ backgroundColor: colors.primary700, height: 1 }} />
);

export const AccountModalContent: React.FC = (props) => {
  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.dragIndicator} />
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-user.png")}
        title={"Profile"}
        onPress={() => console.log("Profile press")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-settings.png")}
        title={"Settings"}
        onPress={() => console.log("Settings press")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/wallet.png")}
        title={"Wallet"}
        onPress={() => console.log("Wallet press")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-outline-globe.png")}
        title={"Language"}
        onPress={() => console.log("Language press")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-help.png")}
        title={"Help"}
        onPress={() => console.log("Help press")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-bug.png")}
        title={"Report a bug"}
        onPress={() => console.log("Report bug press")}
      />
      <View />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.primary800,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary300,
    alignSelf: "center",
    marginVertical: 8,
  },
});

import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius } from "../../constants/dogeStyle";
import { AccountModalRow } from "./AccountModalRow";

const separator = (
  <View style={{ backgroundColor: colors.primary700, height: 1 }} />
);

export type AccountModalContentProps = {
  onPress: (pageName: string) => void;
};

export const AccountModalContent: React.FC<AccountModalContentProps> = ({
  onPress,
}) => {
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.content, { paddingBottom: inset.bottom }]}>
      <View style={styles.dragIndicator} />
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-user.png")}
        title={"Profile"}
        onPress={() => onPress("Profile")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-settings.png")}
        title={"Settings"}
        onPress={() => onPress("Settings")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/wallet.png")}
        title={"Wallet"}
        onPress={() => onPress("Wallet")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-outline-globe.png")}
        title={"Language"}
        onPress={() => onPress("Language")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-help.png")}
        title={"Help"}
        onPress={() => onPress("Help")}
      />
      {separator}
      <AccountModalRow
        icon={require("../../assets/images/account/sm-solid-bug.png")}
        title={"Report a bug"}
        onPress={() => onPress("ReportBug")}
      />
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.primary800,
    borderTopLeftRadius: radius.m,
    borderTopRightRadius: radius.m,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary300,
    alignSelf: "center",
    marginVertical: 12,
  },
});

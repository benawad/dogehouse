import React from "react";
import { StyleSheet, View } from "react-native";
import { TitledHeader } from "../../components/header/TitledHeader";
import { colors } from "../../constants/dogeStyle";

export const WalletController: React.FC = () => {
  return (
    <>
      <TitledHeader title={"Wallet"} showBackButton={true} />
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

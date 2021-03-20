import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/dogeStyle";
import { IconButton } from "../buttons/IconButton";
import { ProfileButton } from "./ProfileButton";

export const Header: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.leftContainer}>
        <ProfileButton icon={require("../../assets/images/100.png")} />
      </View>
      <View style={styles.rightContainer}>
        <IconButton
          icon={require("../../assets/images/header/sm-solid-notification.png")}
          style={{ marginLeft: 30 }}
          onPress={() => navigation.navigate("Notifications")}
        />
        <IconButton
          icon={require("../../assets/images/header/sm-solid-messages.png")}
          style={{ marginLeft: 30 }}
          onPress={() => navigation.navigate("Messages")}
        />
        <IconButton
          icon={require("../../assets/images/header/sm-solid-search.png")}
          style={{ marginLeft: 30 }}
          onPress={() => navigation.navigate("Search")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary900,
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
  leftContainer: {},
  rightContainer: {
    flexDirection: "row",
  },
});

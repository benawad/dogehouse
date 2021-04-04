import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/dogeStyle";
import { useConn } from "../../shared-hooks/useConn";
import { IconButton } from "../buttons/IconButton";
import { ProfileButton } from "./ProfileButton";

export const Header: React.FC = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const conn = useConn();
  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <View style={styles.leftContainer}>
        <ProfileButton icon={{ uri: conn.user.avatarUrl }} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary900,
    flexDirection: "row",
    paddingHorizontal: 25,
  },
  leftContainer: {
    height: 70,
    justifyContent: "center",
  },
  rightContainer: {
    flexDirection: "row",
  },
});

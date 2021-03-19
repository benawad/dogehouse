import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/dogeStyle";
import { SingleUserAvatar } from "./avatars/SingleUserAvatar";
import { IconButton } from "./buttons/IconButton";

export const Header: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <SingleUserAvatar
            src={require("../assets/images/100.png")}
            size={"sm"}
            isOnline={true}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <IconButton
          iconName={"notifications"}
          iconSize={24}
          iconColor={colors.text}
          style={{ marginLeft: 20 }}
          onPress={() => navigation.navigate("Notifications")}
        />
        <IconButton
          iconName={"chatbubbles"}
          iconSize={24}
          iconColor={colors.text}
          style={{ marginLeft: 20 }}
          onPress={() => navigation.navigate("Messages")}
        />
        <IconButton
          iconName={"search"}
          iconSize={24}
          iconColor={colors.text}
          style={{ marginLeft: 20 }}
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
    padding: 16,
    paddingTop: 16,
  },
  leftContainer: {},
  rightContainer: {
    flexDirection: "row",
  },
});

import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/dogeStyle";
import { SingleUserAvatar } from "./avatars/SingleUserAvatar";
import { IconButton } from "./buttons/IconButton";

export const Header: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.leftContainer}>
        <SingleUserAvatar
          src={require("../assets/images/100.png")}
          size={"sm"}
          isOnline={true}
        />
      </View>
      <View style={styles.rightContainer}>
        <IconButton
          iconName={"notifications"}
          iconSize={24}
          iconColor={colors.text}
          style={{ marginLeft: 20 }}
          onPress={() => console.log("Notifications Pressed")}
        />
        <IconButton
          iconName={"chatbubbles"}
          iconSize={24}
          iconColor={colors.text}
          style={{ marginLeft: 20 }}
          onPress={() => console.log("Chat Pressed")}
        />
        <IconButton
          iconName={"search"}
          iconSize={24}
          iconColor={colors.text}
          style={{ marginLeft: 20 }}
          onPress={() => console.log("Search Pressed")}
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

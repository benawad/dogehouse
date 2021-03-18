import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/GlobalStyles";
import { IconButton } from "./buttons/iconButton";

export const Header: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.leftContainer}>
        <IconButton
          iconName={"people"}
          iconSize={24}
          iconColor={colors.text}
          onPress={() => console.log("Avatar Pressed")}
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
    paddingTop: 0,
  },
  leftContainer: {},
  rightContainer: {
    flexDirection: "row",
  },
});

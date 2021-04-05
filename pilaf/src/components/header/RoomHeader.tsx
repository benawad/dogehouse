import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import {
  colors,
  h4,
  paragraph,
  paragraphBold,
  small,
  smallBold,
} from "../../constants/dogeStyle";
import { IconButton } from "../buttons/IconButton";
import { HeaderBase } from "./HeaderBase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/core";

type RoomHeaderProps = {
  showBackButton: boolean;
  onLeavePress: () => void;
  roomTitle: string;
  roomSubtitle: string;
};

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  showBackButton = true,
  onLeavePress,
  roomTitle,
  roomSubtitle,
}) => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <TouchableOpacity
        style={styles.leftContainer}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../../assets/images/header/sm-solid-caret-right.png")}
        />
      </TouchableOpacity>
      <View style={styles.middleContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{ ...h4, flex: 1, textAlign: "center" }}
            numberOfLines={1}
          >
            {roomTitle}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{ ...small, flex: 1, textAlign: "center" }}
            numberOfLines={1}
          >
            with <Text style={{ ...smallBold }}>{roomSubtitle}</Text>
          </Text>
        </View>
      </View>
      <Text style={styles.rightContainer} onPress={onLeavePress}>
        Leave
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary900,
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  leftContainer: {
    paddingLeft: 25,
    height: 70,
    justifyContent: "center",
  },
  middleContainer: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  rightContainer: {
    alignSelf: "center",
    marginRight: 20,
    ...paragraphBold,
    color: colors.accent,
  },
});

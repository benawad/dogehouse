import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MultipleUserAvatar } from "../components/avatars/MultipleUserAvatar";
import { SingleUserAvatar } from "../components/avatars/SingleUserAvatar";
import { BaseOverlay } from "../components/BaseOverlay";
import { FollowNotification } from "../components/notifications/FollowNotification";
import { GenericNotification } from "../components/notifications/GenericNotification";
import { LiveNotification } from "../components/notifications/LiveNotification";
import { NewRoomNotification } from "../components/notifications/NewRoomNotification";
import { colors, fontFamily } from "../constants/dogeStyle";

export const ExplorePage: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: fontFamily.extraBold,
          color: colors.text,
        }}
      >
        Explore Page
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});

import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FollowNotification } from "../components/notifications/FollowNotification";
import { LiveNotification } from "../components/notifications/LiveNotification";
import { NewRoomNotification } from "../components/notifications/NewRoomNotification";
import { colors, fontFamily } from "../constants/dogeStyle";

export const NotificationsPage: React.FC = () => {
  return (
    <SafeAreaView
      style={styles.safeAreaView}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView>
        <NewRoomNotification
          username={"DrMadTurkey"}
          time={"now"}
          joined={true}
        />
        <LiveNotification username={"DrMadTurkey"} time={"now"} joined={true} />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={true}
        />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={false}
        />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={true}
        />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.primary900,
  },
});

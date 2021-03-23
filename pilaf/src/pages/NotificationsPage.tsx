import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TitledHeader } from "../components/header/TitledHeader";
import { FollowNotification } from "../components/notifications/FollowNotification";
import { LiveNotification } from "../components/notifications/LiveNotification";
import { NewRoomNotification } from "../components/notifications/NewRoomNotification";
import { colors } from "../constants/dogeStyle";

export const NotificationsPage: React.FC = () => {
  return (
    <>
      <TitledHeader title={"Notifications"} showBackButton={true} />
      <ScrollView style={styles.scrollView}>
        <NewRoomNotification
          username={"DrMadWithAVeryLongLongLongTurkey"}
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
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.primary900,
  },
});

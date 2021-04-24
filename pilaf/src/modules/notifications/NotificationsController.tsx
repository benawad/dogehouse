import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { TitledHeader } from "../../components/header/TitledHeader";
import { FollowNotification } from "../../components/notifications/FollowNotification";
import { LiveNotification } from "../../components/notifications/LiveNotification";
import { NewRoomNotification } from "../../components/notifications/NewRoomNotification";
import { colors, h4 } from "../../constants/dogeStyle";

export const NotificationsController: React.FC = () => {
  return (
    <>
      <TitledHeader title={"Notifications"} showBackButton={true} />
      <ScrollView style={styles.scrollView}>
        <Text style={{ ...h4, marginTop: 10, marginBottom: 20 }}>Today</Text>
        <NewRoomNotification
          username={"DrMadWithAVeryLongLongLongTurkey"}
          time={"now"}
          joined={true}
          style={{ marginBottom: 27 }}
        />
        <LiveNotification
          username={"DrMadTurkey"}
          time={"now"}
          joined={true}
          style={{ marginBottom: 27 }}
        />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={true}
          style={{ marginBottom: 27 }}
        />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={false}
          style={{ marginBottom: 27 }}
        />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={true}
          style={{ marginBottom: 27 }}
        />
        <FollowNotification
          username={"DrMadTurkey"}
          userAvatarSrc={require("../../assets/images/100.png")}
          time={"now"}
          isOnline={true}
          following={true}
          style={{ marginBottom: 27 }}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.primary900,
    paddingHorizontal: 25,
  },
});

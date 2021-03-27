import React from "react";

import { ScrollView, StyleSheet, Text } from "react-native";
import { RoomCard } from "../components/RoomCard";
import { colors, h3, paragraph } from "../constants/dogeStyle";
import { FeedController } from "../modules/dashboard/FeedController";

export const DashboardPage: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <FeedController />
      <RoomCard
        style={{ marginBottom: 20 }}
        title="Why CI & CD is important when working with a team and more because I need a long one"
        subtitle="This is the subtitle This is the subtitle This is the subtitle This is the subtitle This is the subtitle"
        listeners={400}
        avatarSrcs={[
          require("../assets/images/100.png"),
          require("../assets/images/100.png"),
          require("../assets/images/100.png"),
        ]}
        tags={[
          <Text style={{ ...paragraph }}>#Business</Text>,
          <Text style={{ ...paragraph }}>#Business</Text>,
          <Text style={{ ...paragraph }}>#Business</Text>,
          <Text style={{ ...paragraph }}>#Business</Text>,
        ]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary900,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    ...h3,
    marginBottom: 20,
  },
});

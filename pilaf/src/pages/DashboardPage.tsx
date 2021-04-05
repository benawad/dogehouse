import React from "react";

import { ScrollView, StyleSheet, Text } from "react-native";
import { FeaturedRoomCard } from "../components/FeaturedRoomCard";
import { RoomCard } from "../components/RoomCard";
import { Tag } from "../components/Tag";
import { colors, h3, paragraph } from "../constants/dogeStyle";
import { FeedController } from "../modules/dashboard/FeedController";

export const DashboardPage: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <FeaturedRoomCard
        style={{ marginBottom: 20 }}
        title="Starting your dream business in times of Covid"
        subtitle="Marcus Bloch, Don Velez"
        listeners={400}
        avatarSrcs={[
          require("../assets/images/100.png"),
          require("../assets/images/100.png"),
          require("../assets/images/100.png"),
        ]}
        tags={[
          <Tag style={{ marginRight: 10 }} key={"trending"} glow>
            <Text style={{ ...paragraph }}>🔥 Trending</Text>
          </Tag>,
          <Tag style={{ marginRight: 10 }} key={"business-1"}>
            <Text style={{ ...paragraph }}>#Business</Text>
          </Tag>,
          <Tag style={{ marginRight: 10 }} key={"business-2"}>
            <Text style={{ ...paragraph }}>#Business</Text>
          </Tag>,
          <Tag style={{ marginRight: 10 }} key={"business-3"}>
            <Text style={{ ...paragraph }}>#Business</Text>
          </Tag>,
        ]}
      />
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
          <Tag style={{ marginRight: 10 }} key={"business"}>
            <Text style={{ ...paragraph }}>#Business</Text>
          </Tag>,
          <Tag style={{ marginRight: 10 }} key={"business-2"}>
            <Text style={{ ...paragraph }}>#Business</Text>
          </Tag>,
          <Tag style={{ marginRight: 10 }} key={"business-3"}>
            <Text style={{ ...paragraph }}>#Business</Text>
          </Tag>,
          <Tag style={{ marginRight: 10 }} key={"business-4"}>
            <Text style={{ ...paragraph }}>#Business</Text>
          </Tag>,
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

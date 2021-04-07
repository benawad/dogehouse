import React from "react";

import { ScrollView, StyleSheet, Text } from "react-native";
import { FeaturedRoomCard } from "../components/FeaturedRoomCard";
import { RoomCard } from "../components/RoomCard";
import { Tag } from "../components/Tag";
import { colors, h3, smallBold } from "../constants/dogeStyle";
import { FeedController } from "../modules/dashboard/FeedController";

export const DashboardPage: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <FeedController />
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

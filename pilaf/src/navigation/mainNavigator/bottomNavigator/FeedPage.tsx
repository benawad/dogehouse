import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { colors, h3 } from "../../../constants/dogeStyle";
import { FeedController } from "../../../modules/feed/FeedController";

export const FeedPage: React.FC = () => {
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

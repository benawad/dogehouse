import { addDays } from "date-fns";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import {
  ScheduledRoomSummaryCardProps,
  UpcomingRoomCard,
} from "../components/UpcomingRoomCard";
import { colors, h3 } from "../constants/dogeStyle";

const today = new Date();
const src = require("../assets/images/100.png");
const upcomingRoomsMock: ScheduledRoomSummaryCardProps[] = [
  {
    id: "1",
    scheduledFor: today,
    speakersInfo: {
      avatars: [src],
      speakers: ["Dough Terry"],
    },
    title: "Live with u/DeepFuckingValue",
  },
  {
    id: "2",
    scheduledFor: addDays(today, 1),
    speakersInfo: {
      avatars: [src, src],
      speakers: ["Daniel Gailey", "Bennie Beyers"],
    },
    title: "Is Apple equipment worth it?",
  },
  {
    id: "3",
    scheduledFor: addDays(today, 2),
    speakersInfo: {
      avatars: [src, src, src],
      speakers: ["Jessika Beyer", "Jefferey Bosco", "Hang Ness"],
    },
    title:
      "Starting your dream business in times of Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut ultricies turpis, vitae consectetur quam. Suspendisse venenatis justo justo, in pulvinar urna facilisis ut.",
  },
];

export const SchedulePage: React.FC = () => {
  return (
    <ScrollView style={styles.safeAreaView}>
      <Text style={styles.title}>Schedule</Text>
      {upcomingRoomsMock.map((m) => (
        <UpcomingRoomCard key={m.id} room={m} style={{ marginBottom: 20 }} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
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

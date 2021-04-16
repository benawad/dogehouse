import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { UpcomingRoomCard } from "../../components/UpcomingRoomCard";
import { colors, h3 } from "../../constants/dogeStyle";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";

export const ScheduleController: React.FC = () => {
  const { data } = useTypeSafeQuery(["getScheduledRooms", "", false]);
  return (
    <ScrollView style={styles.safeAreaView}>
      <Text style={styles.title}>Schedule</Text>
      {data?.scheduledRooms.map((sr) => (
        <UpcomingRoomCard
          key={sr.id}
          room={{
            ...sr,
            id: sr.id,
            scheduledFor: new Date(sr.scheduledFor),
            title: sr.name,
            speakersInfo: {
              avatars: [{ uri: sr.creator.avatarUrl }],
              speakers: [sr.creator.username],
            },
          }}
          style={{ marginBottom: 20 }}
        />
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

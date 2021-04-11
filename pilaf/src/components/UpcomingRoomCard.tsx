import { format, isToday, isTomorrow } from "date-fns";
import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";
import { colors, radius, small } from "../constants/dogeStyle";
import { MultipleUserAvatar } from "./avatars/MultipleUserAvatar";
import { RoomCardHeading } from "./RoomCardHeading";

const formattedDate = (scheduledFor: Date) => {
  if (isToday(scheduledFor)) {
    return "TODAY " + format(scheduledFor, "K:mm a");
  } else if (isTomorrow(scheduledFor)) {
    return "TOMMOROW " + format(scheduledFor, "K:mm a");
  } else {
    return format(scheduledFor, "EEE, do MMM, K:mm a");
  }
};

export interface UserCardProps {
  avatars: ImageSourcePropType[];
  speakers: string[];
}

export interface ScheduledRoomSummaryCardProps {
  id: string;
  scheduledFor: Date;
  speakersInfo: UserCardProps;
  title: string;
}

export type UpcomingRoomsCardProps = ViewProps & {
  room: ScheduledRoomSummaryCardProps;
};

export const UpcomingRoomCard: React.FC<UpcomingRoomsCardProps> = ({
  style,
  room,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.scheduleFor}>{formattedDate(room.scheduledFor)}</Text>
      <RoomCardHeading text={room.title} />
      <View style={styles.content}>
        <MultipleUserAvatar srcArray={room.speakersInfo.avatars} size={"xs"} />
        <Text style={styles.speakers}>
          {room.speakersInfo.speakers.join(", ")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary800,
    borderRadius: radius.m,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scheduleFor: {
    ...small,
    color: colors.accent,
  },
  content: {
    flexDirection: "row",
    marginTop: 10,
  },
  speakers: {
    ...small,
    color: colors.primary300,
    marginLeft: 7,
  },
});

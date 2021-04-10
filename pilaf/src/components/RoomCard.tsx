import { differenceInMilliseconds, format, isPast, isToday } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  paragraph,
  paragraphBold,
  radius,
} from "../constants/dogeStyle";
import { MultipleUserAvatar } from "./avatars/MultipleUserAvatar";
import { BubbleText } from "./BubbleText";
import { RoomCardHeading } from "./RoomCardHeading";

function formatNumber(num: number): string {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1))}K`
    : `${Math.sign(num) * Math.abs(num)}`;
}

function useScheduleRerender(scheduledFor?: Date) {
  // same logic stolen from kofta, rerenders
  // at the scheduleFor date
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!scheduledFor) {
      return;
    }

    let done = false;
    const id = setTimeout(() => {
      done = true;
      rerender((x) => x + 1);
    }, differenceInMilliseconds(scheduledFor, new Date()) + 1000);

    return () => {
      if (!done) {
        clearTimeout(id);
      }
    };
  }, [scheduledFor]);
}

export type RoomCardProps = {
  style?: ViewStyle;
  title: string;
  avatarSrcs: ImageSourcePropType[];
  subtitle: string;
  scheduledFor?: Date;
  listeners: number;
  tags: React.ReactNode[];
  onPress?: () => void;
};

export const RoomCard: React.FC<RoomCardProps> = ({
  style,
  title,
  avatarSrcs,
  subtitle,
  scheduledFor,
  listeners,
  tags,
  onPress,
}) => {
  useScheduleRerender(scheduledFor);

  let scheduledForLabel = "";

  if (scheduledFor) {
    if (isToday(scheduledFor)) {
      scheduledForLabel = format(scheduledFor, "K:mm a");
    } else {
      scheduledForLabel = format(scheduledFor, "LLL d");
    }
  }

  const roomLive = !scheduledFor || isPast(scheduledFor);

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.topContainer}>
        <View style={styles.topLeftContainer}>
          <RoomCardHeading
            icon={
              roomLive ? undefined : (
                <Image source={require("../assets/images/lg-solid-time.png")} />
              )
            }
            text={title}
          />
          <View style={styles.subtitleContainer}>
            {avatarSrcs.length > 0 && (
              <MultipleUserAvatar
                srcArray={avatarSrcs}
                size={"xs"}
                translationRatio={1.5}
              />
            )}
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>
        <View style={styles.topRightContainer}>
          <BubbleText style={{ alignSelf: "flex-start" }} live={roomLive}>
            <Text style={styles.bubbleLabel}>
              {roomLive ? formatNumber(listeners) : scheduledForLabel}
            </Text>
          </BubbleText>
        </View>
      </View>
      <View />
      {tags && tags.length > 0 && (
        <View style={styles.tagsContainer}>{tags.map((tag) => tag)}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary800,
    borderRadius: radius.m,
    padding: 20,
  },
  topContainer: {
    flexDirection: "row",
  },
  topLeftContainer: {
    flex: 1,
  },
  topRightContainer: {},
  headingContainer: {
    flexDirection: "row",
  },
  subtitleContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  subtitle: {
    ...paragraph,
    color: colors.primary300,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 32,
    borderRadius: radius.s,
    overflow: "hidden",
  },
  bubbleLabel: {
    ...paragraphBold,
  },
});

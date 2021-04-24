import { differenceInMilliseconds, format, isPast, isToday } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import {
  colors,
  paragraphBold,
  radius,
  small,
} from "../../constants/dogeStyle";
import { BubbleText } from "../BubbleText";
import { RoomCardHeading } from "../RoomCardHeading";

function formatNumber(num: number): string {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1))}K`
    : `${Math.sign(num) * Math.abs(num)}`;
}

function useScheduleRerender(scheduledFor?: Date) {
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

export type RoomSearchResultProps = ViewProps & {
  style?: ViewStyle;
  title: string;
  subtitle: string;
  scheduledFor?: Date;
  listeners: number;
  onPress?: () => void;
};

export const RoomSearchResult: React.FC<RoomSearchResultProps> = ({
  style,
  title,
  subtitle,
  scheduledFor,
  listeners,
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
                <Image
                  source={require("../../assets/images/lg-solid-time.png")}
                />
              )
            }
            text={title}
          />
          <View style={styles.subtitleContainer}>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.m,
    paddingVertical: 10,
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
  },
  subtitle: {
    ...small,
    color: colors.primary300,
    flex: 1,
  },
  bubbleLabel: {
    ...paragraphBold,
  },
});

import { differenceInMilliseconds, format, isPast, isToday } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  h4,
  paragraph,
  paragraphBold,
  radius,
} from "../constants/dogeStyle";
import { MultipleUserAvatar } from "./avatars/MultipleUserAvatar";
import { BubbleText } from "./BubbleText";

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

export type FeaturedRoomCardProps = {
  style?: ViewStyle;
  title: string;
  avatarSrcs: ImageSourcePropType[];
  subtitle: string;
  scheduledFor?: Date;
  listeners: number;
  tags: React.ReactNode[];
  onPress?: () => void;
};

export const FeaturedRoomCard: React.FC<FeaturedRoomCardProps> = ({
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
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/images/featured-card-bg.png")}
      >
        <View style={styles.topContainer}>
          <View style={styles.topLeftContainer}>
            <Text style={{ ...h4 }} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.subtitleContainer}>
              {avatarSrcs.length > 0 && (
                <MultipleUserAvatar
                  srcArray={avatarSrcs}
                  size={"md"}
                  translationRatio={1.5}
                />
              )}
              <View>
                <Text style={styles.subtitleLabel}>Hosted by</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
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
        {tags && tags.length > 0 && (
          <View style={styles.tagsContainer}>{tags.map((tag) => tag)}</View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary800,
    borderColor: colors.primary300,
    borderRadius: radius.m,
    borderWidth: 1,
    overflow: "hidden", // prevents image from cutting off bottom border
    shadowColor: colors.primary100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    padding: 15,
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
  subtitleLabel: {
    ...paragraph,
    color: colors.primary300,
    flex: 1,
  },
  subtitle: {
    ...paragraph,
    color: colors.primary100,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 40,
    borderRadius: radius.s,
    overflow: "hidden",
  },
  bubbleLabel: {
    ...paragraphBold,
  },
});

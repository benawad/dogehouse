import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  paragraph,
  radius,
} from "../../constants/dogeStyle";
import { SingleUserAvatar } from "../avatars/SingleUserAvatar";
import { GenericNotification } from "./GenericNotification";

interface FollowNotificationProps {
  style?: ViewStyle;
  userAvatarSrc: ImageSourcePropType;
  username: string;
  userProfileLink?: string;
  time: string;
  isOnline?: boolean;
  following?: boolean;
}

export const FollowNotification: React.FC<FollowNotificationProps> = ({
  style,
  userAvatarSrc,
  isOnline = false,
  username,
  userProfileLink,
  time,
  following = false,
}) => {
  const icon = (
    <SingleUserAvatar src={userAvatarSrc} size="sm" isOnline={isOnline} />
  );

  const notificationMsg = (
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.title, { fontWeight: "700" }]}>
        {username}
        <Text style={styles.title}> followed you</Text>
      </Text>
    </View>
  );

  const followButton = (
    <TouchableOpacity
      style={[
        styles.button,
        following && { backgroundColor: colors.primary700 },
      ]}
    >
      <Text style={styles.buttonTitle}>
        {following ? "Following" : "Follow back"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GenericNotification
      style={style}
      notificationMsg={notificationMsg}
      time={time}
      icon={icon}
      actionButton={followButton}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    ...paragraph,
    flex: 1,
    flexWrap: "wrap",
    lineHeight: 18,
  },
  button: {
    height: 22,
    width: 90,
    backgroundColor: colors.accent,
    borderRadius: radius.s,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.semiBold,
    fontWeight: "700",
    color: colors.text,
  },
});

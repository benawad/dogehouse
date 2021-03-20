import React, { ReactNode } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { colors, fontFamily, fontSize } from "../../constants/dogeStyle";
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
      <Text style={[styles.textPrimary, { fontFamily: fontFamily.bold }]}>
        {username}
        <Text style={styles.textPrimary}> followed you</Text>
      </Text>
    </View>
  );

  const followButton = (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonTitle}>
        {following ? "Followed" : "Follow back"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GenericNotification
      notificationMsg={notificationMsg}
      time={time}
      icon={icon}
      actionButton={followButton}
    />
  );
};

const styles = StyleSheet.create({
  textPrimary: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.paragraph,
    flex: 1,
    flexWrap: "wrap",
  },
  button: {
    height: 32,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonTitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.semiBold,
    fontWeight: "700",
    color: colors.text,
  },
});

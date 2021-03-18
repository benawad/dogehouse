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
import Icon from "react-native-vector-icons/Ionicons";

interface LiveNotificationProps {
  style?: ViewStyle;
  username: string;
  userProfileLink?: string;
  time: string;
  joined?: boolean;
}

export const LiveNotification: React.FC<LiveNotificationProps> = ({
  style,
  username,
  userProfileLink,
  time,
  joined = false,
}) => {
  const icon = <Icon name={"alarm"} size={40} color={colors.text} />;

  const notificationMsg = (
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.textPrimary, { fontFamily: fontFamily.bold }]}>
        {username}
        <Text style={styles.textPrimary}> is now live!</Text>
      </Text>
    </View>
  );

  const joinButton = (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonTitle}>{joined ? "Joined" : "Join room"}</Text>
    </TouchableOpacity>
  );

  return (
    <GenericNotification
      notificationMsg={notificationMsg}
      time={time}
      icon={icon}
      actionButton={joinButton}
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

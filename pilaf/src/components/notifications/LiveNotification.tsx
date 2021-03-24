import React from "react";
import {
  Image,
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
import { GenericNotification } from "./GenericNotification";

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
  const icon = (
    <Image source={require("../../assets/images/lg-solid-time.png")} />
  );

  const notificationMsg = (
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.title, { fontWeight: "700" }]}>
        {username}
        <Text style={styles.title}> is now live!</Text>
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
      style={style}
      notificationMsg={notificationMsg}
      time={time}
      icon={icon}
      actionButton={joinButton}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    ...paragraph,
    lineHeight: 18,
    flex: 1,
    flexWrap: "wrap",
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

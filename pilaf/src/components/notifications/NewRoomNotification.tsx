import React, { ReactNode } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors, fontFamily, fontSize } from "../../constants/dogeStyle";
import { GenericNotification } from "./GenericNotification";

interface NewRoomNotificationProps {
  style?: ViewStyle;
  username: string;
  userProfileLink?: string;
  time: string;
  joined?: boolean;
}

export const NewRoomNotification: React.FC<NewRoomNotificationProps> = ({
  style,
  username,
  userProfileLink,
  time,
  joined = false,
}) => {
  const icon = <Image source={require("../../assets/images/ios-rocket.png")} />;

  const notificationMsg = (
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.textPrimary, { fontFamily: fontFamily.bold }]}>
        {username}
        <Text style={styles.textPrimary}> created a room</Text>
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
    height: 22,
    width: 90,
    backgroundColor: colors.accent,
    borderRadius: 8,
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

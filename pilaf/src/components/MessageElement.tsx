import React, { useState } from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { formatDistance, fromUnixTime } from "date-fns";
import { SingleUserAvatar } from "./avatars/SingleUserAvatar";
import { colors, fontFamily, fontSize } from "../constants/dogeStyle";

interface MessageElementProps {
  user: {
    username: string;
    avatar: ImageSourcePropType;
    isOnline: boolean;
  };
  msg: {
    ts: number;
    text: string;
  };
}

interface MessageDateProps {
  ts: number;
  style?: TextStyle;
}

const MessageDate: React.FC<MessageDateProps> = ({ ts, style }) => (
  <Text style={style}>{formatDistance(fromUnixTime(ts), new Date())} ago</Text>
);

export const MessageElement: React.FC<MessageElementProps> = ({
  user,
  msg,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.container}>
        <SingleUserAvatar
          size={"sm"}
          isOnline={user.isOnline}
          src={user.avatar}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.textContainer}>
            <Text style={styles.textUserName}>{user.username}</Text>
            <MessageDate style={styles.textDate} ts={msg.ts} />
          </View>
          <Text style={styles.textMessage} numberOfLines={expanded ? 0 : 1}>
            {msg.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
  },
  textUserName: {
    fontFamily: fontFamily.regular,
    fontWeight: "700",
    fontSize: fontSize.paragraph,
    color: colors.text,
  },
  textDate: {
    fontFamily: fontFamily.regular,
    fontWeight: "500",
    fontSize: fontSize.small,
    color: colors.primary300,
  },
  textMessage: {
    marginLeft: 16,
    fontFamily: fontFamily.regular,
    fontWeight: "500",
    fontSize: fontSize.small,
    color: colors.primary300,
  },
});

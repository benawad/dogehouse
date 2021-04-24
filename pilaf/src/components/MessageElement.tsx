import { formatDistance, fromUnixTime } from "date-fns";
import React, { useState } from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { colors, paragraphBold, small } from "../constants/dogeStyle";
import { SingleUserAvatar } from "./avatars/SingleUserAvatar";

export type MessageElementProps = ViewProps & {
  user: {
    username: string;
    avatar: ImageSourcePropType;
    isOnline: boolean;
  };
  msg: {
    ts: number;
    text: string;
  };
};

interface MessageDateProps {
  ts: number;
  style?: TextStyle;
}

const MessageDate: React.FC<MessageDateProps> = ({ ts, style }) => (
  <Text style={style}>{formatDistance(fromUnixTime(ts), new Date())} ago</Text>
);

export const MessageElement: React.FC<MessageElementProps> = ({
  style,
  user,
  msg,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={[styles.container, style]}>
        <SingleUserAvatar
          size={"sm"}
          isOnline={user.isOnline}
          src={user.avatar}
          style={{ marginBottom: 20 }}
        />
        <View style={styles.middleContainer}>
          <Text style={styles.textUserName}>{user.username}</Text>
          <Text style={styles.textMessage} numberOfLines={1}>
            {msg.text}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <MessageDate style={styles.textDate} ts={msg.ts} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  middleContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary700,
    paddingBottom: 20,
    paddingLeft: 0,
    marginLeft: 11,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  dateContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-start",

    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.primary700,
  },
  textUserName: {
    ...paragraphBold,
  },
  textDate: {
    ...small,
    color: colors.primary300,
  },
  textMessage: {
    ...small,
    color: colors.primary300,
  },
});

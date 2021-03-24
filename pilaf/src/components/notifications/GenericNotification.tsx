import React, { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors, paragraph, small } from "../../constants/dogeStyle";

interface GenericNotificationProps {
  style?: ViewStyle;
  notificationMsg: ReactNode;
  time: string;
  actionButton?: ReactNode;
  icon?: ReactNode;
}

export const GenericNotification: React.FC<GenericNotificationProps> = ({
  style,
  notificationMsg,
  time,
  actionButton,
  icon,
}) => {
  const defaultMessage = (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.title}>{"You have a notification"}</Text>
    </View>
  );
  return (
    <View style={[style, styles.container]}>
      <View>
        {icon ? icon : <Icon name={"rocket"} size={32} color={colors.text} />}
      </View>
      <View style={styles.middleView}>
        {notificationMsg ? notificationMsg : defaultMessage}
        <Text style={styles.time}>{time}</Text>
      </View>
      {actionButton && <View style={styles.button}>{actionButton}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  middleView: {
    marginHorizontal: 16,
    flexGrow: 1,
  },
  title: {
    ...paragraph,
    lineHeight: 18,
    flex: 1,
    flexWrap: "wrap",
  },
  time: {
    ...small,
    color: colors.primary300,
    lineHeight: 18,
  },
  button: {
    height: 22,
  },
});

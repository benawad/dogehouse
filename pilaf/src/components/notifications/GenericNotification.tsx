import React, { ReactNode } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors, fontFamily, fontSize } from "../../constants/dogeStyle";
import Icon from "react-native-vector-icons/Ionicons";

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
      <Text style={styles.textPrimary}>{"You have a notification"}</Text>
    </View>
  );
  return (
    <View style={[style, styles.container]}>
      <View>
        {icon ? icon : <Icon name={"rocket"} size={32} color={colors.text} />}
      </View>
      <View style={styles.middleView}>
        {notificationMsg ? notificationMsg : defaultMessage}
        <Text style={styles.textSecondary}>{time}</Text>
      </View>
      {actionButton && <View style={styles.button}>{actionButton}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  middleView: {
    marginHorizontal: 16,
    flexGrow: 1,
  },
  textPrimary: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.paragraph,
    flex: 1,
    flexWrap: "wrap",
    lineHeight: 18,
  },
  textSecondary: {
    color: colors.primary300,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.small,
    lineHeight: 18,
  },
  button: {
    height: 22,
  },
});

import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";
import { colors, fontSize, radius, smallBold } from "../constants/dogeStyle";

const badgeVariants = {
  primary: colors.primary600,
  secondary: colors.accent,
};

export type UserBadgeProps = ViewProps & {
  color?: keyof typeof badgeVariants;
  text?: string;
  icon?: ImageSourcePropType;
};

export const UserBadge: React.FC<UserBadgeProps> = ({
  text,
  icon,
  color = "primary",
}) => {
  return (
    <View style={[styles.container, { backgroundColor: badgeVariants[color] }]}>
      {text && <Text style={styles.text}>{text}</Text>}
      {icon && (
        <Image
          source={icon}
          height={12}
          width={12}
          style={{ height: 12, width: 12 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "baseline",
    alignItems: "center",
    justifyContent: "center",
    height: 16,
    minWidth: 31,
    borderRadius: radius.s,
  },
  text: {
    ...smallBold,
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
});

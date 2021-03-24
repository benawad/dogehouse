import React, { ReactElement } from "react";
import { StyleSheet, Text } from "react-native";
import { paragraphBold } from "../constants/dogeStyle";

export interface RoomCardHeadingProps {
  icon?: ReactElement;
  text: string;
}

export const RoomCardHeading: React.FC<RoomCardHeadingProps> = ({
  icon,
  text,
}) => {
  return (
    <>
      {icon && icon}
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  text: {
    ...paragraphBold,
    marginRight: 40,
  },
});

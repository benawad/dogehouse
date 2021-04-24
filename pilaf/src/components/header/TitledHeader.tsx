import React from "react";
import { StyleSheet, Text } from "react-native";
import { h4 } from "../../constants/dogeStyle";
import { HeaderBase } from "./HeaderBase";

type TitledHeaderProps = {
  showBackButton: boolean;
  title: string;
};

export const TitledHeader: React.FC<TitledHeaderProps> = ({
  showBackButton = true,
  title,
}) => {
  return (
    <HeaderBase showBackButton={showBackButton}>
      <Text style={styles.text}>{title}</Text>
    </HeaderBase>
  );
};

const styles = StyleSheet.create({
  text: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    marginRight: 66,
    marginLeft: 25,
    ...h4,
  },
});

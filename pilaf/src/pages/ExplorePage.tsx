import React from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/dogeStyle";
import { useConn } from "../shared-hooks/useConn";

export const ExplorePage: React.FC = () => {
  const conn = useConn();
  return <Text>Explore page</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});

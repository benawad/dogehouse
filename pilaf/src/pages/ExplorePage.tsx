import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserPreview } from "../components/UserPreview";
import { colors, fontFamily } from "../constants/dogeStyle";
import { useConn } from "../shared-hooks/useConn";

export const ExplorePage: React.FC = () => {
  const conn = useConn();
  return <UserPreview user={conn.user} volume={100} style={{ flex: 1 }} />;
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});

import { JoinRoomAndGetInfoResponse, Room } from "@dogehouse/kebab";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { h4 } from "../../constants/dogeStyle";
import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";

interface RoomUsersPanelProps extends JoinRoomAndGetInfoResponse {}

export const RoomUsersPanel: React.FC<RoomUsersPanelProps> = (props) => {
  const { askingToSpeak, listeners, speakers } = useSplitUsersIntoSections(
    props
  );
  return (
    <View>
      <Text style={{ ...h4, marginBottom: 20 }}>
        Speakers ({speakers.length})
      </Text>
      <View style={styles.avatarsContainer}>{speakers}</View>
      {askingToSpeak.length ? (
        <Text style={{ ...h4, marginBottom: 20 }}>Asking to speak</Text>
      ) : null}
      <View style={styles.avatarsContainer}>{askingToSpeak}</View>
      {listeners.length ? (
        <Text style={{ ...h4, marginBottom: 20 }}>
          Listeners ({listeners.length})
        </Text>
      ) : null}
      <View style={styles.avatarsContainer}>{listeners}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
    flex: 1,
  },
  avatarsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  avatar: {
    marginRight: 10,
    marginBottom: 10,
  },
});

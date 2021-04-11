import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Tag } from "../../components/Tag";
import { h4, smallBold } from "../../constants/dogeStyle";
import { useSplitUsersIntoSections } from "./useSplitUsersIntoSections";

interface RoomUsersPanelProps extends JoinRoomAndGetInfoResponse {}

export const RoomUsersPanel: React.FC<RoomUsersPanelProps> = (props) => {
  const { askingToSpeak, listeners, speakers } = useSplitUsersIntoSections(
    props
  );
  return (
    <View style={{ paddingBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <Text style={{ ...h4 }}>Speakers</Text>
        <Tag style={{ marginLeft: 10, alignSelf: "center", height: 18 }}>
          <Text style={{ ...smallBold, lineHeight: 18 }}>
            {speakers.length}
          </Text>
        </Tag>
      </View>
      <View style={styles.avatarsContainer}>{speakers}</View>
      {askingToSpeak.length ? (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <Text style={{ ...h4 }}>Asking to speak</Text>
          <Tag style={{ marginLeft: 10, alignSelf: "center", height: 18 }}>
            <Text style={{ ...smallBold, lineHeight: 18 }}>
              {askingToSpeak.length}
            </Text>
          </Tag>
        </View>
      ) : null}
      <View style={styles.avatarsContainer}>{askingToSpeak}</View>
      {listeners.length ? (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <Text style={{ ...h4 }}>Listeners</Text>
          <Tag style={{ marginLeft: 10, alignSelf: "center", height: 18 }}>
            <Text style={{ ...smallBold, lineHeight: 18 }}>
              {listeners.length}
            </Text>
          </Tag>
        </View>
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
    justifyContent: "flex-start",
  },
  avatar: {
    marginRight: 10,
    marginBottom: 10,
  },
});

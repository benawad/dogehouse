import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { validate as uuidValidate } from "uuid";
import { RoomHeader } from "../../components/header/RoomHeader";
import { colors } from "../../constants/dogeStyle";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { RoomStackParamList } from "../../navigation/mainNavigator/RoomNavigator";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { RoomUsersPanel } from "./RoomUsersPanel";

type RoomPageRouteProp = RouteProp<RoomStackParamList, "RoomMain">;

type RoomPageProps = {
  route: RoomPageRouteProp;
};

export const RoomPanelController: React.FC<RoomPageProps> = ({ route }) => {
  const { mutateAsync: leaveRoom } = useTypeSafeMutation("leaveRoom");
  const navigation = useNavigation();
  const { setCurrentRoomId } = useCurrentRoomIdStore();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", route.params.data.room.id || ""],
    {
      enabled: uuidValidate(route.params.data.room.id),
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (!("error" in d)) {
          setCurrentRoomId(() => d.room.id);
        }
      }) as any,
    },
    [route.params.data.room.id]
  );

  if (!data || "error" in data) {
    return null;
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.primary900 }}>
        <RoomHeader
          onLeavePress={() => {
            leaveRoom([]);
            setCurrentRoomId(null);
            navigation.navigate("Home");
          }}
          onTitlePress={() => {
            navigation.navigate("RoomDescription", { data: data });
          }}
          roomTitle={data.room.name}
          roomSubtitle={data.room.peoplePreviewList
            .filter((u) => u.id === data.room.creatorId)
            .map((u) => u.displayName)
            .join(", ")}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.avatarsContainer]}
        >
          <RoomUsersPanel {...data} />
        </ScrollView>
      </View>
      {/* <UserPreviewModal {...route.params} /> */}
    </>
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
  },
  avatar: {
    marginRight: 10,
    marginBottom: 10,
  },
});

import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TitledHeader } from "../../components/header/TitledHeader";
import { colors, h4, paragraph } from "../../constants/dogeStyle";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { isUuid } from "../../lib/isUuid";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useNavigation } from "@react-navigation/core";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { RoomUsersPanel } from "./RoomUsersPanel";
interface RoomPanelControllerProps {
  roomId?: string | undefined;
}

const placeHolder = (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.primary900,
    }}
  >
    <TitledHeader title={""} showBackButton={true} />
    <ActivityIndicator color={colors.text} />
  </View>
);

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({
  roomId,
}) => {
  const { mutateAsync: leaveRoom } = useTypeSafeMutation("leaveRoom");
  const navigation = useNavigation();
  const { currentRoomId, setCurrentRoomId } = useCurrentRoomIdStore();
  const { data, isLoading } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", roomId || ""],
    {
      enabled: isUuid(roomId),
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (!("error" in d)) {
          setCurrentRoomId(() => d.room.id);
        }
      }) as any,
    },
    [roomId]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!data) {
      setCurrentRoomId(null);
      navigation.navigate("Home");
      return;
    }
    if ("error" in data) {
      setCurrentRoomId(null);
      //showErrorToast(data.error);
      navigation.navigate("Home");
    }
  }, [data, isLoading, navigation.navigate, setCurrentRoomId]);

  if (isLoading || !currentRoomId) {
    return placeHolder;
  }

  if (!data || "error" in data) {
    return null;
  }

  const roomCreator = data.users.find((x) => x.id === data.room.creatorId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary900 }}>
      <TitledHeader title={data.room.name} showBackButton={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.avatarsContainer}
      >
        <RoomUsersPanel {...data} style={styles.avatar} />
      </ScrollView>

      <Button
        title={"leave the room"}
        onPress={() => {
          leaveRoom([]);
          navigation.navigate("Home");
        }}
      />
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

import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect } from "react";
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { TitledHeader } from "../../components/header/TitledHeader";
import { colors } from "../../constants/dogeStyle";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { isUuid } from "../../lib/isUuid";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { RoomUsersPanel } from "./RoomUsersPanel";
import { Spinner } from "../../components/Spinner";
import { RoomHeader } from "../../components/header/RoomHeader";
import { setMute, useSetMute } from "../../shared-hooks/useSetMute";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { RoomChat } from "./chat/RoomChat";
import { useRoomChatStore } from "./chat/useRoomChatStore";
import { UserPreviewModal } from "../../components/UserPreview";
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
    <Spinner size={"m"} />
  </View>
);

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({
  roomId,
}) => {
  const conn = useWrappedConn();
  const { mutateAsync: leaveRoom } = useTypeSafeMutation("leaveRoom");
  const navigation = useNavigation();
  const { currentRoomId, setCurrentRoomId } = useCurrentRoomIdStore();
  const isANewRoom = currentRoomId !== roomId;
  const setInternalMute = useSetMute();
  const muted = useMuteStore((s) => s.muted);
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
    <>
      <View style={{ flex: 1, backgroundColor: colors.primary900 }}>
        <RoomHeader
          showBackButton={true}
          onLeavePress={() => {
            leaveRoom([]);
            setCurrentRoomId(null);
            navigation.navigate("Home");
          }}
          onMutePress={() => {
            setInternalMute(!muted);
          }}
          onSpeakPress={() => conn.connection.send("ask_to_speak", {})}
          muted={muted}
          canAskToSpeak={true}
        />
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.avatarsContainer]}
          >
            <RoomUsersPanel {...data} />
          </ScrollView>
          <RoomChat {...data} style={{ flex: 1 }} />
        </KeyboardAvoidingView>
      </View>
      <UserPreviewModal {...data} />
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

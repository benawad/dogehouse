import { Room } from "@dogehouse/kebab";
import React, { useCallback } from "react";
import { FlatList, View } from "react-native";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { RoomMessage } from "./RoomMessage";
import { RoomChatMessage, useRoomChatStore } from "./useRoomChatStore";

interface ChatListProps {
  room: Room;
  onUsernamePress: (userId: string, message?: RoomChatMessage) => void;
}

export const RoomChatList: React.FC<ChatListProps> = ({
  room,
  onUsernamePress,
}) => {
  const messages = useRoomChatStore((s) => s.messages);

  const me = useConn().user;
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();

  const renderMessage = useCallback(
    ({ item }) => {
      return (
        <RoomMessage
          m={item}
          me={me}
          iAmMod={iAmMod}
          iAmCreator={iAmCreator}
          creatorId={room.creatorId}
          onUsernamePress={onUsernamePress}
        />
      );
    },
    [iAmCreator, iAmMod, me, onUsernamePress, room.creatorId]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View
      style={{
        padding: 5,
        paddingHorizontal: 25,
        flexGrow: 1,
      }}
    >
      <FlatList
        inverted
        style={{ flex: 1, marginBottom: 10, paddingBottom: 10 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
        }}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

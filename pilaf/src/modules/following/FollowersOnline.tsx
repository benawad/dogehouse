import { UserWithFollowInfo } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React, { MouseEventHandler } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SingleUserAvatar } from "../../components/avatars/SingleUserAvatar";
import { Button } from "../../components/buttons/Button";
import { colors, h3, paragraphBold, small } from "../../constants/dogeStyle";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useRoomChatStore } from "../room/chat/useRoomChatStore";

export interface FriendOnlineType {
  username: string;
  avatarUrl: string;
  isOnline: boolean;
  activeRoom?: {
    name: string;
    link?: string;
  };
}

export interface FriendsOnlineProps {
  onlineFriendList: UserWithFollowInfo[];
  onlineFriendCount?: number;
  showMoreAction?: MouseEventHandler<HTMLDivElement>;
}

export const FollowerOnline: React.FC<UserWithFollowInfo> = ({
  username,
  avatarUrl: avatar,
  online,
  currentRoom,
}) => {
  const navigation = useNavigation();
  const { currentRoomId } = useCurrentRoomIdStore();
  const [clearChat] = useRoomChatStore((s) => [s.clearChat]);
  const prefetch = useTypeSafePrefetch();

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
    >
      <SingleUserAvatar
        size="sm"
        isOnline={online}
        src={{ uri: avatar }}
        // username={username}
      />
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <Text style={{ ...paragraphBold }} numberOfLines={1}>
          {username}
        </Text>
        {currentRoom ? (
          <Text
            style={{ ...small, lineHeight: 14, color: colors.primary300 }}
            numberOfLines={1}
          >
            {currentRoom.name}
          </Text>
        ) : (
          <Text style={{ ...small, lineHeight: 14, color: colors.primary300 }}>
            Not in a room
          </Text>
        )}
      </View>
      {currentRoom && (
        <Button
          title={"Join room"}
          onPress={() => {
            if (currentRoom.id !== currentRoomId) {
              clearChat();
              prefetch(
                ["joinRoomAndGetInfo", currentRoom.id],
                [currentRoom.id]
              );
            }
            navigation.navigate("Room", { roomId: currentRoom.id });
          }}
          size={"small"}
          style={{ alignSelf: "center", marginLeft: 10 }}
        />
      )}
    </TouchableOpacity>
  );
};

export const FollowersOnlineWrapper: React.FC<{
  onlineFriendCount?: number;
}> = ({ children }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>People</Text>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary900,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    ...h3,
    marginBottom: 20,
  },
});

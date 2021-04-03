import { Room } from "@dogehouse/kebab";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  colors,
  fontSize,
  radius,
  small,
  smallBold,
} from "../../../constants/dogeStyle";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { UserPreviewModalContext } from "../UserPreviewModalProvider";
import { emoteMap } from "./EmoteData";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { RoomChatMessage, useRoomChatStore } from "./useRoomChatStore";

interface ChatListProps {
  room: Room;
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 10;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const onUserPress = (userId: string, message?: RoomChatMessage) => {};

export const RoomChatList: React.FC<ChatListProps> = ({ room }) => {
  const { setData } = useContext(UserPreviewModalContext);
  const scrollView = useRef<ScrollView>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const messages = useRoomChatStore((s) => s.messages);

  const me = useConn().user;
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();
  const [
    messageToBeDeleted,
    setMessageToBeDeleted,
  ] = useState<RoomChatMessage | null>(null);
  const {
    isRoomChatScrolledToTop,
    setIsRoomChatScrolledToTop,
  } = useRoomChatStore();

  useEffect(() => {
    if (!isRoomChatScrolledToTop) {
      scrollView.current.scrollTo({ y: listHeight - scrollViewHeight });
    }
  }, [scrollViewHeight, listHeight]);

  return (
    <View
      style={{
        padding: 5,
        flex: 1,
      }}
    >
      <ScrollView
        style={{ flex: 1, marginBottom: 10 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
        ref={scrollView}
        onLayout={(e) => {
          const height = e.nativeEvent.layout.height;
          setScrollViewHeight(height);
        }}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setListHeight(contentHeight);
        }}
        onScroll={({ nativeEvent }) => {
          const closeToBottom = isCloseToBottom(nativeEvent);
          setIsRoomChatScrolledToTop(!closeToBottom);
          if (closeToBottom) {
            useRoomChatMentionStore.getState().resetIAmMentioned();
          }
        }}
        scrollEventThrottle={100}
      >
        {messages
          .slice()
          .reverse()
          .map((m) => (
            <View
              key={m.id}
              style={[
                { marginTop: 8 },
                m.isWhisper
                  ? {
                      backgroundColor: colors.primary700,
                      borderRadius: radius.s,
                    }
                  : {},
              ]}
            >
              {m.isWhisper && (
                <Text
                  style={{
                    ...small,
                    fontSize: fontSize.xs,
                    color: colors.primary300,
                    marginHorizontal: 5,
                  }}
                >
                  Whisper
                </Text>
              )}
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() =>
                    setData({
                      userId: m.userId,
                      message:
                        (me?.id === m.userId ||
                          iAmCreator ||
                          (iAmMod && room.creatorId !== m.userId)) &&
                        !m.deleted
                          ? m
                          : undefined,
                    })
                  }
                >
                  <Text
                    style={{
                      ...smallBold,
                      color: m.color,
                      marginHorizontal: 5,
                    }}
                  >
                    {m.username}:{" "}
                  </Text>
                </TouchableOpacity>

                <Text style={{ ...small }}>
                  {m.deleted ? (
                    <Text>
                      [message{" "}
                      {m.deleterId === m.userId ? "retracted" : "deleted"}]
                    </Text>
                  ) : (
                    m.tokens.map(({ t: token, v }, i) => {
                      switch (token) {
                        case "text":
                          return <Text key={i}>{v} </Text>;
                        case "emote":
                          return emoteMap[v] ? (
                            <Image key={i} source={emoteMap[v]} />
                          ) : (
                            ":" + v + ":"
                          );

                        case "mention": {
                          if (!m.isWhisper) {
                            return (
                              <Text
                                key={i}
                                style={{
                                  color: colors.primary300,
                                }}
                              >
                                @{v}{" "}
                              </Text>
                            );
                          }
                          return null;
                        }

                        case "link":
                          return (
                            <Text key={i}>
                              {v}
                              {/* {normalizeUrl(v, { stripProtocol: true })}{" "} */}
                            </Text>
                          );
                        case "block":
                          return <Text key={i}>{v}</Text>;
                        default:
                          return null;
                      }
                    })
                  )}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

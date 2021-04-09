import { Room } from "@dogehouse/kebab";
import React, { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  colors,
  fontSize,
  radius,
  small,
  smallBold,
} from "../../../constants/dogeStyle";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { emoteMap } from "./EmoteData";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { RoomChatMessage, useRoomChatStore } from "./useRoomChatStore";

interface ChatListProps {
  room: Room;
  onUsernamePress: (userId: string, message?: RoomChatMessage) => void;
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 10;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export const RoomChatList: React.FC<ChatListProps> = ({
  room,
  onUsernamePress,
}) => {
  const scrollView = useRef<ScrollView>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const messages = useRoomChatStore((s) => s.messages);

  const me = useConn().user;
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();
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
        paddingHorizontal: 25,
        flexGrow: 1,
      }}
    >
      <ScrollView
        style={{ flex: 1, marginBottom: 10, paddingBottom: 10 }}
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
                      paddingHorizontal: 5,
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
                  }}
                >
                  Whisper
                </Text>
              )}
              <Text>
                <Text
                  style={{
                    ...smallBold,
                    color: m.color,
                    marginHorizontal: 5,
                    textAlignVertical: "center",
                  }}
                  onPress={() => {
                    onUsernamePress(
                      m.userId,
                      (me?.id === m.userId ||
                        iAmCreator ||
                        (iAmMod && room.creatorId !== m.userId)) &&
                        !m.deleted
                        ? m
                        : undefined
                    );
                  }}
                >
                  {m.username}:{" "}
                </Text>

                <Text style={{ ...small, lineHeight: undefined }}>
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
                            m.tokens.find((t) => t.t === "text") !==
                            undefined ? (
                              <Image
                                key={i}
                                source={emoteMap[v]}
                                style={{
                                  height: 20,
                                  width: 20,
                                }}
                              />
                            ) : (
                              <Image key={i} source={emoteMap[v]} />
                            )
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
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

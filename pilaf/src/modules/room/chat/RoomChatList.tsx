import { Room } from "@dogehouse/kebab";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  paragraph,
  radius,
  small,
  smallBold,
} from "../../../constants/dogeStyle";
import { useConn } from "../../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../../shared-hooks/useCurrentRoomInfo";
import { emoteMap } from "./EmoteData";
import { RoomChatInput } from "./RoomChatInput";
import { RoomChatMessage, useRoomChatStore } from "./useRoomChatStore";

interface ChatListProps {
  room: Room;
}

export const RoomChatList: React.FC<ChatListProps> = ({ room }) => {
  const scrollView = useRef<ScrollView>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  useEffect(() => {
    scrollView.current.scrollTo({ y: listHeight - scrollViewHeight });
  }, [scrollViewHeight, listHeight]);
  const messages = useRoomChatStore((s) => s.messages);

  const me = useConn().user;
  const { isMod: iAmMod, isCreator: iAmCreator } = useCurrentRoomInfo();
  const [
    messageToBeDeleted,
    setMessageToBeDeleted,
  ] = useState<RoomChatMessage | null>(null);
  // const bottomRef = useRef<null | HTMLDivElement>(null);
  const {
    isRoomChatScrolledToTop,
    setIsRoomChatScrolledToTop,
  } = useRoomChatStore();

  // Only scroll into view if not manually scrolled to top
  // useEffect(() => {
  //   isRoomChatScrolledToTop || bottomRef.current?.scrollIntoView();
  // });

  return (
    <View
      style={{
        // backgroundColor: colors.primary800,
        padding: 10,
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
          // get the component measurements from the callbacks event
          const height = e.nativeEvent.layout.height;

          // save the height of the scrollView component to the state
          // this.setState({ scrollViewHeight: height });
          setScrollViewHeight(height);
        }}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setListHeight(contentHeight);
        }}
      >
        {messages
          .slice()
          .reverse()
          .map((m) => (
            <View key={m.id}>
              <Text style={{ ...smallBold, color: m.color }}>
                {m.username}:{" "}
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
                            <Image key={i} source={{ uri: emoteMap[v] }} />
                          ) : (
                            ":" + v + ":"
                          );

                        case "mention":
                          return <Text>@{v} </Text>;
                        case "link":
                          return (
                            <Text>
                              {v}
                              {/* {normalizeUrl(v, { stripProtocol: true })}{" "} */}
                            </Text>
                          );
                        case "block":
                          return <Text>{v}</Text>;
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

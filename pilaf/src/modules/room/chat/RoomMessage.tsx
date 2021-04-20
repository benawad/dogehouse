import { User } from "@dogehouse/kebab";
import React from "react";
import { Image, Text, View } from "react-native";
import {
  colors,
  fontSize,
  radius,
  small,
  smallBold,
} from "../../../constants/dogeStyle";
import { emoteMap } from "./EmoteData";
import { RoomChatMessage } from "./useRoomChatStore";

const RoomMessageMemoized: React.FC<{
  m: RoomChatMessage;
  me: User;
  iAmCreator: boolean;
  iAmMod: boolean;
  creatorId: string;
  onUsernamePress: (userId: string, message?: RoomChatMessage) => void;
}> = ({ m, me, iAmCreator, iAmMod, creatorId, onUsernamePress }) => {
  console.log(m);
  return (
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
                (iAmMod && creatorId !== m.userId)) &&
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
              [message {m.deleterId === m.userId ? "retracted" : "deleted"}]
            </Text>
          ) : (
            m.tokens.map(({ t: token, v }, i) => {
              switch (token) {
                case "text":
                  return <Text key={i}>{v} </Text>;
                case "emote":
                  return emoteMap[v] ? (
                    m.tokens.find((t) => t.t === "text") !== undefined ? (
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
  );
};

export const RoomMessage = React.memo(RoomMessageMemoized, (prev, next) => {
  return prev.m.id === next.m.id && prev.m.deleted === next.m.deleted;
});

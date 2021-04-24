import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SearchHeader } from "../../components/header/SearchHeader";
import { UserSearchResult } from "../../components/search/UserSearchResult";
import {
  colors,
  h4,
  paragraph,
  paragraphBold,
  small,
  smallBold,
} from "../../constants/dogeStyle";

type RoomDescriptionControllerProps = {
  data: JoinRoomAndGetInfoResponse;
};

export const RoomDescriptionController: React.FC<RoomDescriptionControllerProps> = ({
  data,
}) => {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchHeader
        onTextChange={setQuery}
        text={query}
        autoFocus={false}
        placeHolder={"Search in the room"}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary900,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 25,
          }}
        >
          <Text style={{ ...h4 }}>{data.room.name}</Text>
          <Text style={{ ...small }}>
            with{" "}
            <Text style={{ ...smallBold }}>
              {data.users.find((u) => u.id === data.room.creatorId).displayName}
            </Text>
          </Text>
          {data.room.description ? (
            <Text
              style={{ ...paragraph, color: colors.primary300, marginTop: 10 }}
            >
              {data.room.description}
            </Text>
          ) : (
            <></>
          )}
        </View>
        <View
          style={{
            backgroundColor: colors.primary300,
            height: 0.5,
            marginVertical: 20,
          }}
        />
        <ScrollView>
          {query.length === 0 && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ ...paragraphBold, marginBottom: 10 }}>
                Speakers
              </Text>
              {data.users
                .filter(
                  (u) =>
                    u.id === data.room.creatorId || u.roomPermissions?.isSpeaker
                )
                .map((u) => (
                  <UserSearchResult
                    key={u.id}
                    userAvatarSrc={{ uri: u.avatarUrl }}
                    userName={u.username}
                    isOnline={true}
                    userLink={u.username}
                  />
                ))}
              <Text style={{ ...paragraphBold, marginVertical: 10 }}>
                Listeners
              </Text>
              {data.users
                .filter(
                  (u) =>
                    u.id !== data.room.creatorId &&
                    !u.roomPermissions?.isSpeaker
                )
                .map((u) => (
                  <UserSearchResult
                    key={u.id}
                    userAvatarSrc={{ uri: u.avatarUrl }}
                    userName={u.username}
                    isOnline={true}
                    userLink={u.username}
                  />
                ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

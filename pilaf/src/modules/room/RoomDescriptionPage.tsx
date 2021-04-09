import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SearchHeader } from "../../components/header/SearchHeader";
import { RoomSearchResult } from "../../components/search/RoomSearchResult";
import { SearchHistoryResult } from "../../components/search/SearchHistoryResult";
import { SearchHistoryResultList } from "../../components/search/SearchHistoryResultList";
import { UserSearchResult } from "../../components/search/UserSearchResult";
import {
  colors,
  h4,
  paragraph,
  paragraphBold,
  small,
  smallBold,
} from "../../constants/dogeStyle";
import { RoomStackParamList } from "../../navigation/RoomNavigator";

const searchMocks = [
  {
    id: 0,
    title:
      "Why CI & CD is important when working with a team and more because I need a long one",
    subtitle:
      "This is the subtitle This is the subtitle This is the subtitle This is the subtitle This is the subtitle",
    listeners: 300,
  },
  {
    id: 1,
    title: "Why Elon Musk buys DogeCoin",
    subtitle: "Because he can",
    listeners: 200,
  },
  {
    id: 2,
    title: "The developer's hangout",
    subtitle: "Terry Owen, Grace Abraham",
    listeners: 200,
  },
  {
    id: 3,
    title: "Why we should remove React from Earth",
    subtitle: "Because Angular is Better",
    listeners: 230000,
  },
];

const historyMocks = [
  {
    id: 0,
    query: "Elon",
  },
  {
    id: 1,
    query: "React",
  },
];

type RoomDescriptionPageRouteProp = RouteProp<
  RoomStackParamList,
  "RoomDescription"
>;

type RoomDescriptionPageProps = {
  route: RoomDescriptionPageRouteProp;
};

export const RoomDescriptionPage: React.FC<RoomDescriptionPageProps> = ({
  route,
}) => {
  const [query, setQuery] = useState("");
  const data = route.params.data;
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

import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SearchHeader } from "../components/header/SearchHeader";
import { RoomSearchResult } from "../components/search/RoomSearchResult";
import { SearchHistoryResult } from "../components/search/SearchHistoryResult";
import { SearchHistoryResultList } from "../components/search/SearchHistoryResultList";
import { UserSearchResult } from "../components/search/UserSearchResult";
import { colors } from "../constants/dogeStyle";

const searchMocks = [
  {
    id: 0,
    title:
      "Why CI & CD is important when working with a team and more because I need a long one",
    subtitle:
      "This is the subtitle This is the subtitle This is the subtitle This is the subtitle This is the subtitle",
    listeners: 200,
  },
  {
    id: 1,
    title: "Why Elon Musk buys DogeCoin",
    subtitle: "Because he can",
    listeners: 200,
  },
  {
    id: 2,
    title: "It is a good day to die",
    subtitle: "Tomorrow too",
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

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchHeader onTextChange={setQuery} text={query} />
      <View
        style={{ flex: 1, backgroundColor: colors.primary900, padding: 20 }}
      >
        {query.length === 0 && (
          <SearchHistoryResultList>
            {historyMocks.map((m) => (
              <SearchHistoryResult
                key={m.id}
                query={m.query}
                onPress={() => setQuery(m.query)}
                onDeletePress={() => console.log("delete clic")}
              />
            ))}
          </SearchHistoryResultList>
        )}
        {query.length > 0 && (
          <ScrollView style={{ backgroundColor: colors.primary900 }}>
            {searchMocks
              .filter((m) => m.title.includes(query))
              .map((m) => (
                <RoomSearchResult
                  key={m.id}
                  style={{ marginBottom: 20 }}
                  title={m.title}
                  subtitle={m.subtitle}
                  listeners={m.listeners}
                />
              ))}
            <UserSearchResult
              isOnline={true}
              userName={"DrMadTurkey"}
              userLink={"@emerciercontexeo"}
              userAvatarSrc={require("../assets/images/100.png")}
            />
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.primary900,
  },
});

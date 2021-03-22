import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily } from "../constants/dogeStyle";
import { useNavigation } from "@react-navigation/core";
import { Header } from "../components/header/Header";
import { IconButton } from "../components/buttons/IconButton";
import { HeaderBase } from "../components/header/HeaderBase";
import { SearchHeader } from "../components/header/SearchHeader";
import { RoomSearchResult } from "../components/search/RoomSearchResult";
import { UserSearchResult } from "../components/search/UserSearchResult";

const searchMocks = [
  {
    title:
      "Why CI & CD is important when working with a team and more because I need a long one",
    subtitle:
      "This is the subtitle This is the subtitle This is the subtitle This is the subtitle This is the subtitle",
    listeners: 200,
  },
  {
    title: "Why Elon Musk buys DogeCoin",
    subtitle: "Because he can",
    listeners: 200,
  },
  {
    title: "It is a good day to die",
    subtitle: "Tomorrow too",
    listeners: 200,
  },
  {
    title: "Why we should remove React from Earth",
    subtitle: "Because Angular is Better",
    listeners: 230000,
  },
];

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchHeader onTextChange={setQuery} />
      <ScrollView style={{ padding: 16, backgroundColor: colors.primary900 }}>
        {searchMocks
          .filter((m) => m.title.includes(query))
          .map((m) => (
            <RoomSearchResult
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
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.primary900,
  },
});

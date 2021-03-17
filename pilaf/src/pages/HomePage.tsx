/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { fontFamily } from "../constants/GlobalStyles";

export const HomePage: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: fontFamily.extraBold,
        }}
      >
        Home Page
      </Text>
    </SafeAreaView>
  );
};

StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
});

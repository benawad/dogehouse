import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignInButton } from "../components/buttons/SignInButton";
import { SigninWithGithubButton } from "../components/buttons/SigninWithGithub";
import { colors, h1, h3, small } from "../constants/dogeStyle";
import { useSaveTokensFromQueryParams } from "../modules/auth/useSaveTokensFromQueryParams";

export const LandingPage: React.FC = () => {
  useSaveTokensFromQueryParams();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image source={require("../assets/images/Logo.png")} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Welcome</Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 6,
            marginBottom: 30,
          }}
        >
          <Text style={styles.text}>By signing in you accept our </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.text}> and </Text>
          <TouchableOpacity style={{ padding: 0 }}>
            <Text style={styles.link}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
        <SignInButton style={styles.signinButton} provider={"github"} />
        <SignInButton style={styles.signinButton} provider={"twitter"} />
        <SignInButton style={styles.signinButton} provider={"google"} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-evenly",
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity>
          <Image
            source={require("../assets/images/github.png")}
            style={{ tintColor: colors.text }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/twitter.png")}
            style={{ tintColor: colors.text }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/discord.png")}
            style={{ tintColor: colors.text }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    ...h3,
  },
  text: {
    ...small,
  },
  link: {
    ...small,
    color: colors.accent,
    textAlignVertical: "center",
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.primary800,
    paddingHorizontal: 40,
  },
  signinButton: {
    height: 50,
    alignSelf: "stretch",
    marginBottom: 20,
  },
});

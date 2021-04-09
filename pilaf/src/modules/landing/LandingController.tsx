import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SignInButton } from "../../components/buttons/SignInButton";
import { colors, h3, small } from "../../constants/dogeStyle";
import { useSaveTokensFromQueryParams } from "../auth/useSaveTokensFromQueryParams";

export const LandingController: React.FC = () => {
  useSaveTokensFromQueryParams();
  const inset = useSafeAreaInsets();
  return (
    <>
      <View
        style={[
          styles.container,
          { paddingTop: inset.top, paddingBottom: inset.bottom },
        ]}
      >
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/images/Logo.png")}
            style={{ width: "80%", aspectRatio: 168 / 40, height: undefined }}
          />
        </View>
        <View
          style={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
          {Platform.OS === "ios" && (
            <SignInButton style={styles.signinButton} provider={"apple"} />
          )}
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
              source={require("../../assets/images/github.png")}
              style={{ tintColor: colors.text }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/twitter.png")}
              style={{ tintColor: colors.text }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/discord.png")}
              style={{ tintColor: colors.text }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
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
  container: {
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

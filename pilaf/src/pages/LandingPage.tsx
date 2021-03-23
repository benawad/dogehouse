import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SigninWithGithubButton } from "../components/buttons/SigninWithGithub";
import { colors } from "../constants/dogeStyle";
import { useSaveTokensFromQueryParams } from "../modules/auth/useSaveTokensFromQueryParams";

export const LandingPage: React.FC = () => {
  useSaveTokensFromQueryParams();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <SigninWithGithubButton style={styles.signinButton} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
  signinButton: {
    height: 48,
    marginHorizontal: 16,
    alignSelf: "stretch",
  },
});

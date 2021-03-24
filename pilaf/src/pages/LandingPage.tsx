import React from "react";
import { StyleSheet, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { SigninWithGithubButton } from "../components/buttons/SigninWithGithub";
import { colors } from "../constants/dogeStyle";
import { useSaveTokensFromQueryParams } from "../module/auth/useSaveTokensFromQueryParams";
import { apiBaseUrl } from "../constants/env";

const signinWithGithub = async () => {
  try {
    const url =
      apiBaseUrl + "/auth/github/web?redirect_after_base=dogehouse://home";
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: "cancel",
        preferredBarTintColor: "rgba(30, 30, 30, 1)",
        preferredControlTintColor: "white",
        readerMode: false,
        animated: true,
        modalPresentationStyle: "fullScreen",
        modalTransitionStyle: "coverVertical",
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: "rgba(30, 30, 30, 1)",
        secondaryToolbarColor: "black",
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: "slide_in_right",
          startExit: "slide_out_left",
          endEnter: "slide_in_left",
          endExit: "slide_out_right",
        },
        headers: {
          "my-custom-header": "my custom header value",
        },
      });
    } else Linking.openURL(url);
  } catch (error) {
    Alert.alert(error.message);
  }
};

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

import React from "react";
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { colors, paragraphBold, radius } from "../../constants/dogeStyle";
import { apiBaseUrl } from "../../constants/env";

type Provider = "google" | "twitter" | "github" | "apple";

const onPress = async (provider: Provider) => {
  try {
    const url =
      apiBaseUrl +
      "/auth/" +
      provider +
      "/web?redirect_after_base=dogehouse://home";
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: "cancel",
        preferredBarTintColor: colors.primary900,
        preferredControlTintColor: "white",
        readerMode: false,
        animated: true,
        modalPresentationStyle: "fullScreen",
        modalTransitionStyle: "coverVertical",
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: colors.primary900,
        secondaryToolbarColor: colors.text,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        animations: {
          startEnter: "slide_in_right",
          startExit: "slide_out_left",
          endEnter: "slide_in_left",
          endExit: "slide_out_right",
        },
      });
    } else {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export type SignInButtonProps = ViewProps & {
  provider: Provider;
};

const imageSrcs = {
  github: require("../../assets/images/github.png"),
  google: require("../../assets/images/google.png"),
  twitter: require("../../assets/images/twitter.png"),
  apple: require("../../assets/images/apple.png"),
};

const title = {
  github: "Sign in with Github",
  google: "Sign in with Google",
  twitter: "Sign in with Twitter",
  apple: "Sign in with Apple",
};

export const SignInButton: React.FC<SignInButtonProps> = ({
  style,
  provider,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(provider)}
      style={[style, styles.button]}
    >
      <Image source={imageSrcs[provider]} style={{ tintColor: colors.text }} />
      <Text style={styles.title}>{title[provider]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: colors.primary700,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.m,
    paddingRight: 40,
  },
  title: {
    ...paragraphBold,
    marginLeft: 20,
  },
});

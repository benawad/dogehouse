import React from "react";
import {
  Alert,
  Linking,
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { colors, fontFamily } from "../../constants/dogeStyle";

const signinWithGithub = async () => {
  try {
    const url =
      "https://doge-staging.stripcode.dev/auth/github/web?redirect_after_base=dogehouse://home";
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(url, {
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
    } else Linking.openURL(url);
  } catch (error) {
    Alert.alert(error.message);
  }
};

interface SigninWithGithubButtonProps {
  style: StyleProp<ViewStyle>;
}

export const SigninWithGithubButton: React.FC<SigninWithGithubButtonProps> = (
  props
) => {
  return (
    <TouchableOpacity
      onPress={signinWithGithub}
      style={[props.style, styles.button]}
    >
      <Text style={styles.title}>{"Sign in with github"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 16,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamily.semiBold,
  },
});

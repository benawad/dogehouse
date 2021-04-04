import { Linking } from "react-native";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { useTokenStore } from "./useTokenStore";

function getUrlParameter(url: string, name: string) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(url);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export const useSaveTokensFromQueryParams = () => {
  Linking.addEventListener("url", async (e) => {
    const accessToken = getUrlParameter(e.url, "accessToken");
    const refreshToken = getUrlParameter(e.url, "refreshToken");
    await useTokenStore.getState().setTokens({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    InAppBrowser.close();
  });
};

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import "react-native-gesture-handler";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import Toast from "react-native-toast-message";
import { registerGlobals } from "react-native-webrtc";
import { QueryClientProvider } from "react-query";
import { colors } from "./src/constants/dogeStyle";
import { queryClient } from "./src/lib/queryClient";
import { useTokenStore } from "./src/modules/auth/useTokenStore";
import { useSoundEffectStore } from "./src/modules/sound-effect/useSoundEffectStore";
import { useVoiceStore } from "./src/modules/webrtc/stores/useVoiceStore";
import { WebSocketProvider } from "./src/modules/ws/WebSocketProvider";
import { AuthenticationSwitch } from "./src/navigation/AuthenticationSwitch";
import { navigationRef } from "./src/navigation/RootNavigation";
import { MainWsHandlerProvider } from "./src/shared-hooks/useMainWsHandler";

LogBox.ignoreLogs(["Setting a timer"]);

const App: React.FC = () => {
  registerGlobals();

  const loadTokens = useTokenStore((state) => state.loadTokens);
  useSoundEffectStore();
  const isTokenStoreReady = useTokenStore(
    (s) => s.accessToken !== undefined && s.refreshToken !== undefined
  );
  if (!isTokenStoreReady) {
    loadTokens();
  }

  useEffect(() => {
    if (isTokenStoreReady) {
      SplashScreen.hide();
    }
  }, [isTokenStoreReady]);

  const isVoicePrepared = useVoiceStore((s) => s.device !== undefined);
  const prepare = useVoiceStore((state) => state.prepare);
  if (!isVoicePrepared) {
    prepare();
  }

  const deepLinksConf = {
    screens: {
      Room: "room/:roomId",
    },
  };

  const linking: LinkingOptions = {
    prefixes: ["dogehouse://", "https://next.dogehouse.tv"],
    config: deepLinksConf,
  };

  return (
    <WebSocketProvider shouldConnect={true}>
      <QueryClientProvider client={queryClient}>
        <MainWsHandlerProvider />
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef} linking={linking}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.primary900}
            />
            <AuthenticationSwitch />
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </WebSocketProvider>
  );
};

export default App;

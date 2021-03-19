/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useTokenStore } from "./src/module/auth/useTokenStore";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigators/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App: React.FC = () => {
  const loadTokens = useTokenStore((state) => state.loadTokens);
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

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

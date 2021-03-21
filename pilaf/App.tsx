/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import "react-native-gesture-handler";
import "react-native-get-random-values";
import { QueryClientProvider } from "react-query";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useTokenStore } from "./src/modules/auth/useTokenStore";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigators/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "./src/lib/queryClient";

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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;

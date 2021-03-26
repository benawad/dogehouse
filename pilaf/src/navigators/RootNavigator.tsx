import React from "react";
import { useTokenStore } from "../module/auth/useTokenStore";
import { LandingPage } from "../pages/LandingPage";
import { BottomNavigator } from "./BottomNavigator";

export const RootNavigator: React.FC = () => {
  const hasToken = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);

  if (hasToken) {
    return <LandingPage></LandingPage>;
  }
  return <BottomNavigator />;
};

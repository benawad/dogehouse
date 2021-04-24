import React from "react";
import { useTokenStore } from "../modules/auth/useTokenStore";
import { LandingPage } from "./LandingPage";
import { MainNavigator } from "./MainNavigator";

export const AuthenticationSwitch: React.FC = () => {
  const hasToken = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);

  if (!hasToken) {
    return <LandingPage />;
  }

  return <MainNavigator />;
};

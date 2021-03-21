import React from "react";
import { useTokenStore } from "../modules/auth/useTokenStore";
import { LandingPage } from "../pages/LandingPage";
import { MainNavigator } from "./MainNavigator";

export const RootNavigator: React.FC = () => {
  const hasToken = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);

  if (!hasToken) {
    return <LandingPage />;
  }

  return <MainNavigator />;
};

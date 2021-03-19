import React from "react";
import { useTokenStore } from "../module/auth/useTokenStore";
import { LandingPage } from "../pages/LandingPage";
import { MainPage } from "../pages/MainPage";

export const RootNavigator: React.FC = () => {
  const hasToken = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);

  if (!hasToken) {
    return <LandingPage />;
  }
  return <MainPage />;
};

import React from "react";
import { Header } from "../components/header/Header";
import { WebRtcApp } from "../modules/webrtc/WebRtcApp";
import { BottomNavigator } from "../navigators/BottomNavigator";

export const MainPage: React.FC = () => {
  return (
    <>
      <Header />
      <BottomNavigator />
      <WebRtcApp />
    </>
  );
};

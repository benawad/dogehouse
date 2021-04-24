import React from "react";
import { Header } from "../../components/header/Header";
import { BottomNavigator } from "../../navigation/mainNavigator/BottomNavigator";
import { WebRtcApp } from "../webrtc/WebRtcApp";

export const MainController: React.FC = () => {
  return (
    <>
      <Header />
      <BottomNavigator />
      <WebRtcApp />
    </>
  );
};

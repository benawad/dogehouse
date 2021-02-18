import React from "react";
import { BrowserRouter } from "react-router-dom";
import { tw } from "twind";
import { WebRtcApp } from "../webrtc/WebRtcApp";
import { AlertModal } from "./components/AlertModal";
import { CenterLayout } from "./components/CenterLayout";
import { ConfirmModal } from "./components/ConfirmModal";
import { MicPermissionBanner } from "./components/MicPermissionBanner";
import { PromptModal } from "./components/PromptModal";
import { RoomChat } from "./modules/room-chat/RoomChat";
import { Routes } from "./Routes";

interface RouterProps {}

export const Router: React.FC<RouterProps> = () => {
  return (
    <BrowserRouter>
      <WebRtcApp />
      <div
        style={{ maxWidth: 980 }}
        className={tw`mx-auto w-full h-full flex relative`}
      >
        <CenterLayout>
          <Routes />
          <MicPermissionBanner />
        </CenterLayout>
        <RoomChat sidebar />
      </div>
      <AlertModal />
      <PromptModal />
      <ConfirmModal />
    </BrowserRouter>
  );
};

import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { WebRtcApp } from "../webrtc/WebRtcApp";
import { Routes } from "./Routes";

interface RouterProps {}

export const Router: React.FC<RouterProps> = () => {
  return (
    <BrowserRouter>
      <WebRtcApp />
      <Switch>
        <Routes />
      </Switch>
    </BrowserRouter>
  );
};

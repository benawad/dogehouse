import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import ReactModal from "react-modal";
import { WebviewWrapper } from "./WebviewWrapper";

import "./index.css";

ReactModal.setAppElement("#root");

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  enabled: !!process.env.REACT_APP_SENTRY_DSN,
});

ReactDOM.render(
  <React.StrictMode>
    <WebviewWrapper />
  </React.StrictMode>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import { WebviewWrapper } from "./WebviewWrapper";

ReactModal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <WebviewWrapper />
  </React.StrictMode>,
  document.getElementById("root")
);

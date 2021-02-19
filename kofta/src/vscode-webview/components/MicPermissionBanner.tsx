import React, { useState } from "react";
import { tw } from "twind";
import { useMicPermErrorStore } from "../../webrtc/stores/useMicPermErrorStore";
import { sendVoice } from "../../webrtc/utils/sendVoice";
import { isIOS } from "../utils/isIOS";
import { Button } from "./Button";

interface MicPermissionBannerProps {}

export const MicPermissionBanner: React.FC<MicPermissionBannerProps> = () => {
  const { error } = useMicPermErrorStore();
  const [count, setCount] = useState(0);
  if (!error) {
    return null;
  }
  return (
    <div
      style={{
        backgroundColor: "var(--vscode-input-background)",
      }}
      className={tw`p-4`}
    >
      <div
        style={{
          color: "var(--vscode-errorForeground)",
          fontSize: "calc(var(--vscode-font-size)*1.2)",
        }}
        className={tw`font-semibold mb-4`}
      >
        Permission denied trying to access your mic
      </div>
      <Button
        onClick={() => {
          if (count < 2 && !isIOS()) {
            sendVoice();
            setCount((c) => c + 1);
          } else {
            window.location.reload();
          }
        }}
      >
        try again
      </Button>
    </div>
  );
};

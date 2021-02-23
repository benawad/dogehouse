import React, { useEffect } from "react";
import { useMuteStore } from "@dogehouse/feta/webrtc/stores/useMuteStore";

interface MuteTitleUpdaterProps {}

export const MuteTitleUpdater: React.FC<MuteTitleUpdaterProps> = ({}) => {
  const { muted } = useMuteStore();
  useEffect(() => {
    if (muted) {
      document.title = "Muted | DogeHouse";
    } else {
      document.title = "DogeHouse";
    }
  }, [muted]);
  return null;
};

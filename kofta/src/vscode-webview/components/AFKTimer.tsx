import React from "react";
import IdleTimer from "react-idle-timer";
import { useAFKStore } from "../stores/useAFKStore";

interface AFKTimerProps {}

export const AFKTimer: React.FC<AFKTimerProps> = () => {
  const { setIsAFK } = useAFKStore();

  return (
    <IdleTimer
      timeout={1000 * 45}
      onActive={() => setIsAFK(false)}
      onIdle={() => setIsAFK(true)}
      onAction={() => setIsAFK(false)}
      debounce={250}
    />
  );
};

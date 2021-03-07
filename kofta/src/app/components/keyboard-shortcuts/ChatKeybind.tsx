import React, { useEffect, useState } from "react";
import { recordKeyCombination } from "react-hotkeys";
import { useKeyMapStore } from "../../../webrtc/stores/useKeyMapStore";
import { Button } from "../Button";

interface ChatKeybindProps {
  className?: string;
}

export const ChatKeybind: React.FC<ChatKeybindProps> = ({ className }) => {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const {
    keyNames: { CHAT },
    setChatKeybind,
  } = useKeyMapStore();
  useEffect(() => {
    if (count > 0) {
      const unsub = recordKeyCombination(({ id }) => {
        setActive(false);
        setChatKeybind(id as string);
      });

      return () => unsub();
    }
  }, [count, setChatKeybind]);

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        variant="small"
        onClick={() => {
          setCount((c) => c + 1);
          setActive(true);
        }}
      >
        set keybind
      </Button>
      <div className={`ml-4`}>
        toggle chat keybind:{" "}
        <span className={`font-bold text-lg`}>
          {active ? "listening" : CHAT}
        </span>
      </div>
    </div>
  );
};

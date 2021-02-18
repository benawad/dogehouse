import React, { useEffect, useState } from "react";
import { recordKeyCombination } from "react-hotkeys";
import { tw } from "twind";
import { useKeyMapStore } from "../../../webrtc/stores/useKeyMapStore";
import { Button } from "../Button";

interface MuteKeybindProps {
  className?: string;
}

export const MuteKeybind: React.FC<MuteKeybindProps> = ({ className }) => {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const {
    keyNames: { MUTE },
    setMuteKeybind,
  } = useKeyMapStore();
  useEffect(() => {
    if (count > 0) {
      const unsub = recordKeyCombination(({ id }) => {
        setActive(false);
        setMuteKeybind(id as string);
      });

      return () => unsub();
    }
  }, [count, setMuteKeybind]);

  return (
    <div className={tw`flex items-center ${className}`}>
      <Button
        variant="small"
        onClick={() => {
          setCount((c) => c + 1);
          setActive(true);
        }}
      >
        set keybind
      </Button>
      <div className={tw`ml-4`}>
        toggle mute keybind:{" "}
        <span
          style={{
            fontSize: "calc(var(--vscode-font-size)*1.1)",
          }}
          className={tw`font-bold`}
        >
          {active ? "listening" : MUTE}
        </span>
      </div>
    </div>
  );
};

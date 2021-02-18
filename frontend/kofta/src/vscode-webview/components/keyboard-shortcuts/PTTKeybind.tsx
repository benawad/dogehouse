import React, { useEffect, useState } from "react";
import { recordKeyCombination } from "react-hotkeys";
import { tw } from "twind";
import { useKeyMapStore } from "../../../webrtc/stores/useKeyMapStore";
import { Button } from "../Button";

interface PTTKeybindProps {
  className?: string;
}

export const PTTKeybind: React.FC<PTTKeybindProps> = ({ className }) => {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const {
    keyNames: { PTT },
    setPTTKeybind,
  } = useKeyMapStore();
  useEffect(() => {
    if (count > 0) {
      const unsub = recordKeyCombination(({ id }) => {
        setActive(false);
        setPTTKeybind(id as string);
      });

      return () => unsub();
    }
  }, [count, setPTTKeybind]);

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
        toggle push-to-talk keybind:{" "}
        <span
          style={{
            fontSize: "calc(var(--vscode-font-size)*1.1)",
          }}
          className={tw`font-bold`}
        >
          {active ? "listening" : PTT}
        </span>
      </div>
    </div>
  );
};

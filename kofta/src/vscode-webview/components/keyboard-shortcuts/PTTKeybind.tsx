import React, { useEffect, useState } from "react";
import { recordKeyCombination } from "react-hotkeys";
<<<<<<< HEAD
import { useKeyMapStore } from "../../../webrtc/stores/useKeyMapStore";
=======
import { tw } from "twind";
import { useKeyMapStore } from "@dogehouse/feta/webrtc/stores/useKeyMapStore";
>>>>>>> 76e5e6ddabfa381984235042bbfd5056e7372c0d
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
        toggle push-to-talk keybind:{" "}
        <span className={`font-bold text-lg`}>
          {active ? "listening" : PTT}
        </span>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { recordKeyCombination } from "react-hotkeys";
import { useKeyMapStore } from "../../global-stores/useKeyMapStore";
import { Button } from "../../ui/Button";

interface InviteKeybindProps {
  className?: string;
}

export const InviteKeybind: React.FC<InviteKeybindProps> = ({ className }) => {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const {
    keyNames: { INVITE },
    setInviteKeybind,
  } = useKeyMapStore();
  useEffect(() => {
    if (count > 0) {
      const unsub = recordKeyCombination(({ id }) => {
        setActive(false);
        setInviteKeybind(id as string);
      });

      return () => unsub();
    }
  }, [count, setInviteKeybind]);

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        size="small"
        onClick={() => {
          setCount((c) => c + 1);
          setActive(true);
        }}
      >
        set keybind
      </Button>
      <div className={`ml-4`}>
        invite keybind:{" "}
        <span className={`font-bold text-lg`}>
          {active ? "listening" : INVITE}
        </span>
      </div>
    </div>
  );
};

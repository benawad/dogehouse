import React, { useEffect, useState } from "react";
import { recordKeyCombination } from "react-hotkeys";
import { useKeyMapStore } from "../../global-stores/useKeyMapStore";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";

interface PTTKeybindProps {
  className?: string;
}

export const PTTKeybind: React.FC<PTTKeybindProps> = ({ className }) => {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const { t } = useTypeSafeTranslation();
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
        size="small"
        onClick={() => {
          setCount((c) => c + 1);
          setActive(true);
        }}
      >
        {t("components.keyboardShortcuts.setKeybind")}
      </Button>
      <div className={`flex ml-4`}>
        {t("components.keyboardShortcuts.togglePushToTalkKeybind")}:{" "}
        <span className={`font-bold text-lg`}>
          {active ? t("components.keyboardShortcuts.listening") : PTT}
        </span>
      </div>
    </div>
  );
};

import React from "react";
import { BaseSettingsItem } from "./BaseSettingsItem";
import { Button } from "./Button";
import SolidKeyboardIcon from "../icons/SolidKeyboard";
import { Tag } from "./Tag";

const modifiers = {
  ctrl: "ctrlkey",
  alt: "altkey",
  shift: "shiftkey",
};
export interface KeybindCardProps {
  command: string;
  modifier?: keyof typeof modifiers;
  primaryKey: string;
}

export const KeybindCard: React.FC<KeybindCardProps> = ({
  command,
  modifier,
  primaryKey,
}) => {
  const [isListening, setIsListening] = React.useState(false);

  React.useEffect(() => {
    const handleKeybinding = (e: KeyboardEvent) => {
      e.preventDefault();
      // wait for key combination to avoid two updates
      if (["Control", "Alt", "Shift"].includes(e.key)) return;

      let newModifier = "";

      if (e.ctrlKey) newModifier = "ctrl";
      if (e.altKey) newModifier = "alt";
      if (e.shiftKey) newModifier = "shift";

      const keybind = modifier ? [newModifier, e.key] : e.key;

      // handle update keybind
      // ...

      console.log("keybind: ", keybind);
      document.removeEventListener("keydown", handleKeybinding);
      setIsListening(false);
    };

    document.addEventListener("keydown", handleKeybinding);

    return () => {
      document.removeEventListener("keydown", handleKeybinding);
    };
  }, [isListening, modifier]);

  return (
    <BaseSettingsItem
      className={`
            flex justify-between items-center bg-primary-900 px-3 py-4 border border-transparent
            transition
            ${isListening && "border-accent"}
         `}
    >
      <div>
        <div className="text-base font-bold text-primary-100 capitalize">
          {command}
        </div>
      </div>
      <div className="flex items-center">
        {isListening ? (
          <Tag className="uppercase">Listening...</Tag>
        ) : (
          <div className="space-x-1 flex">
            <Tag className="uppercase">{modifier}</Tag>
            <Tag className="uppercase">{primaryKey}</Tag>
          </div>
        )}
        <Button
          size="tiny"
          color="transparent"
          className="ml-4"
          onClick={() => setIsListening(!isListening)}
        >
          <SolidKeyboardIcon className="text-primary-100" />
        </Button>
      </div>
    </BaseSettingsItem>
  );
};

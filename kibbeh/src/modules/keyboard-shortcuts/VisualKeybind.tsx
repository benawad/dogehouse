import React from "react";

interface VisualKeybindProps {
  keybind: string;
}

interface KeybindProperties {
  special: boolean;
  text: string;
}

function orderBySpecial(a: KeybindProperties, b: KeybindProperties) {
  if (a.special && !b.special) {
    return -1;
  } else if(a.special && b.special) {
    return 0;
  }
  return 1;
}

function getButtonProperties(button: string) : KeybindProperties {
  const shortcutMap = new Map<string, string>();
  shortcutMap.set('control', 'Ctrl');
  shortcutMap.set('shift', 'Shift');
  shortcutMap.set('meta', 'Cmd');
  shortcutMap.set('tab', 'Tab');
  shortcutMap.set('alt', 'Alt');
  shortcutMap.set('enter', 'Enter');
  shortcutMap.set('backspace', 'Backspace');
  shortcutMap.set('delete', 'Del');

  const special = shortcutMap.has(button.toLowerCase());
  const text = special ? (shortcutMap.get(button.toLowerCase()) || button) : button;
  return { special, text };
}

export const VisualKeybind: React.FC<VisualKeybindProps> = ({ keybind }) => {
  const buttons = keybind
    .split('+')
    .map((button: string) => getButtonProperties(button))
    .sort(orderBySpecial);

  const styles = {
    button: {
      padding: '.25em .75em',
      fontSize: '.85em',
      border: '1px solid white',
      borderRadius: '.25em',
      margin: '-.25em .75em 0 .75em',
    }
  };

  return (
    <>
      {
        buttons.map((button: KeybindProperties, index: number) => {
          const hasNext = index < buttons.length - 1;
          return (
            <>
              <span style={styles.button} key={`keybind-icon-${index}-${button}`}>
                {button.text}
              </span>
              {hasNext && "+"}
            </>
          );
        })
      }
    </>
  );
};

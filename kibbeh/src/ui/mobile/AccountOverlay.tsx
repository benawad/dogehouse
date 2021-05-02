import React, { useCallback, useEffect } from "react";
import { useSpring, a, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import { useAccountOverlay } from "../../global-stores/useAccountOverlay";
import { createPortal } from "react-dom";
import { SettingsIcon } from "../SettingsIcon";
import {
  SolidBug,
  SolidCalendar,
  SolidDogenitro,
  SolidHelp,
  SolidSettings,
  SolidUser,
  SolidVolume,
  SolidDiscord,
} from "../../icons";

export interface AccountOverlyProps {}

const items: { icon: React.ReactElement; label: string }[] = [
  {
    icon: <SolidUser />,
    label: "Profile",
  },
  {
    icon: <SolidCalendar />,
    label: "Language",
  },
  {
    icon: <SolidDiscord />,
    label: "Debug audio",
  },
  {
    icon: <SolidBug />,
    label: "Report a Bug",
  },
];

const height = items.length * 100 + 20;

export const AccountOverlay: React.FC<AccountOverlyProps> = ({}) => {
  const [{ y }, set] = useSpring(() => ({ y: height }));
  const { isOpen, set: setOpen } = useAccountOverlay((s) => s);

  const open = useCallback(
    ({ canceled }: any) => {
      set({
        y: 0,
        immediate: false,
        config: { mass: 1, tension: 200, friction: 25 },
      });
    },
    [set]
  );

  const close = (velocity = 0) => {
    set({ y: height, immediate: false, config: { ...config.stiff, velocity } });
    setOpen({ isOpen: false });
  };

  const bind = useDrag(
    ({ last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
      if (my < -70) cancel();

      if (last) {
        if (my > height * 0.5 || vy > 0.5) close(vy);
        else open({ canceled });
      } else {
        set({ y: my, immediate: true });
      }
    },
    {
      initial: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );

  const display = y.to((py) => (py < height ? "block" : "none"));

  const bgStyle = {
    opacity: y.to([0, height], [0.8, 0], "clamp"),
  };

  useEffect(() => {
    if (isOpen) {
      open({});
    }
  }, [isOpen, open]);

  return createPortal(
    <a.div
      data-testid="account-overlay"
      className="absolute w-screen h-screen"
      style={{ display }}
    >
      <a.div
        className="w-screen h-screen absolute top-0 left-0 bg-black z-10 opacity-100"
        onClick={() => close()}
        style={bgStyle}
      ></a.div>
      <a.div
        className="bg-primary-800 w-full h-full rounded-t-10 pt-5 relative"
        {...bind()}
        style={{
          bottom: `calc(-100vh + ${height - 100}px)`,
          y,
          zIndex: 11,
          touchAction: "none",
        }}
      >
        <div className="bg-primary-600 rounded-full w-6 h-1 absolute top-3 left-2/4 transform -translate-x-1/2"></div>
        {items.map((item, i) => (
          <SettingsIcon
            icon={React.cloneElement(item.icon, {
              className: "text-primary-100",
              width: 20,
              height: 20,
            })}
            label={item.label}
            key={item.label + i}
            last={i === items.length - 1}
          />
        ))}
      </a.div>
    </a.div>,
    document.querySelector("#__next")!
  );
};

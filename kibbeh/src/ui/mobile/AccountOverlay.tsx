import React, { useCallback, useEffect, useState } from "react";
import { useSpring, a, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import { useAccountOverlay } from "../../global-stores/useAccountOverlay";
import { createPortal } from "react-dom";
import { SettingsIcon } from "../SettingsIcon";
import {
  SolidBug,
  SolidUser,
  SolidVolume,
  SolidDiscord,
  OutlineGlobe,
  SolidLogOut,
} from "../../icons";
import { ApiPreloadLink } from "../../shared-components/ApiPreloadLink";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useConn } from "../../shared-hooks/useConn";
import { useDebugAudioStore } from "../../global-stores/useDebugAudio";
import { closeVoiceConnections } from "../../modules/webrtc/WebRtcApp";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useTokenStore } from "../../modules/auth/useTokenStore";
import router from "next/router";

export interface AccountOverlyProps {}

const height = 500 + 40;

export const AccountOverlay: React.FC<AccountOverlyProps> = ({}) => {
  const { isOpen, set: setOpen } = useAccountOverlay((s) => s);
  const { t } = useTypeSafeTranslation();
  const conn = useConn();
  const { debugAudio, setDebugAudio } = useDebugAudioStore();
  const [{ y }, set] = useSpring(() => ({ y: height }));

  const open = useCallback(() => {
    set({
      y: 0,
      immediate: false,
      config: { mass: 1, tension: 200, friction: 25 },
    });
  }, [set]);

  const close = (velocity = 0) => {
    set({ y: height, immediate: false, config: { ...config.stiff, velocity } });
    setOpen({ isOpen: false });
  };

  const bind = useDrag(
    ({ last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
      if (my < -70) cancel();

      if (last) {
        if (my > height * 0.5 || vy > 0.5) close(vy);
        else open();
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
      open();
    }
  }, [isOpen, open]);

  return createPortal(
    <a.div className="absolute w-screen h-full" style={{ display }}>
      <a.div
        className="w-screen h-screen absolute left-0 bg-black z-10 opacity-100"
        onClick={() => close()}
        style={bgStyle}
      ></a.div>
      <a.div
        className="bg-primary-800 w-full h-full rounded-t-20 relative pt-5"
        {...bind()}
        style={{
          bottom: `calc(-100% + ${height - 100}px)`,
          y,
          zIndex: 11,
          touchAction: "none",
        }}
      >
        <div className="bg-primary-600 rounded-full w-6 h-1 absolute top-3 left-2/4 transform -translate-x-1/2"></div>
        <div>
          <ApiPreloadLink
            data-testid="profile-link"
            route="profile"
            data={{ username: conn ? conn.user.username : "" }}
          >
            <SettingsIcon
              icon={
                <SolidUser
                  className="text-primary-100"
                  width="20"
                  height="20"
                />
              }
              label={t("components.settingsDropdown.profile")}
              onClick={() => close()}
            />
          </ApiPreloadLink>
          <SettingsIcon
            icon={
              <OutlineGlobe
                className="text-primary-100"
                width="20"
                height="20"
              />
            }
            label={t("components.settingsDropdown.language")}
            transition
            onClick={() => {
              close();
              router.push("/language");
            }}
          />
          <a
            href="https://github.com/benawad/dogehouse/issues"
            target="_blank"
            rel="noreferrer"
          >
            <SettingsIcon
              icon={
                <SolidBug className="text-primary-100" width="20" height="20" />
              }
              label={t("components.settingsDropdown.reportABug")}
              onClick={() => close()}
            />
          </a>
          <SettingsIcon
            label={
              !debugAudio
                ? t("components.settingsDropdown.debugAudio.debugAudio")
                : t("components.settingsDropdown.debugAudio.stopDebugger")
            }
            icon={
              <SolidVolume
                className="text-primary-100"
                width="20"
                height="20"
              />
            }
            onClick={() => setDebugAudio(!debugAudio)}
          />
          <a
            href="https://discord.gg/wCbKBZF9cV"
            target="_blank"
            rel="noreferrer"
          >
            <SettingsIcon
              icon={
                <SolidDiscord
                  className="text-primary-100"
                  width="20"
                  height="20"
                />
              }
              label={"Discord"}
              onClick={() => close()}
            />
          </a>
          <SettingsIcon
            label={t("components.settingsDropdown.logOut.button")}
            last
            icon={
              <SolidLogOut
                width="20"
                height="20"
                className="text-primary-100"
              />
            }
            onClick={() => {
              conn.close();
              closeVoiceConnections(null);
              useCurrentRoomIdStore.getState().setCurrentRoomId(null);
              useTokenStore
                .getState()
                .setTokens({ accessToken: "", refreshToken: "" });
              router.push("/logout");
            }}
          />
        </div>
      </a.div>
    </a.div>,
    document.querySelector("#__next")!
  );
};

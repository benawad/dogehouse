import { useAtom } from "jotai";
import React, { useCallback, useEffect, useState } from "react";
import { tw } from "twind";
import { volumeAtom } from "../shared-atoms";
import { useMicIdStore } from "../shared-stores";
import { Button } from "./Button";
import { SetKeyboardShortcuts } from "./SetKeyboardShortcuts";

interface VoiceSettingsProps {}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({}) => {
  const { micId, setMicId } = useMicIdStore();
  const [volume, setVolume] = useAtom(volumeAtom);
  const [options, setOptions] = useState<
    Array<{ id: string; label: string } | null>
  >([]);
  const fetchMics = useCallback(() => {
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((x) =>
        setOptions(
          x
            .map((y) =>
              y.kind !== "audioinput" || !y.deviceId
                ? null
                : { id: y.deviceId, label: y.label }
            )
            .filter((x) => x)
        )
      );
  }, []);
  useEffect(() => {
    fetchMics();
  }, [fetchMics]);

  return (
    <>
      <div className={tw`mb-2`}>mic: </div>
      {options.length ? (
        <select
          className={tw`mb-4`}
          value={micId}
          onChange={(e) => setMicId(e.target.value)}
        >
          {options.map((x) =>
            !x ? null : (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            )
          )}
        </select>
      ) : (
        <>
          <div className={tw`mb-4`}>
            no mics found, you either have none plugged in or haven't given this
            website permission.
          </div>
        </>
      )}
      <div>
        <Button
          variant="small"
          onClick={() => {
            fetchMics();
          }}
        >
          refresh mic list
        </Button>
      </div>
      <div className={tw`mt-8 mb-2`}>volume: </div>
      <div className={tw`mb-8`}>
        {volume}
        <input
          type="range"
          min="1"
          max="100"
          value={volume}
          onChange={(e) => {
            const n = parseInt(e.target.value);
            setVolume(n);
          }}
        />
      </div>
      <SetKeyboardShortcuts />
    </>
  );
};

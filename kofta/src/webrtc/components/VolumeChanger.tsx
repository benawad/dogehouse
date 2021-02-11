import { useAtom } from "jotai";
import React from "react";
import { volumeAtom } from "../../vscode-webview/shared-atoms";

interface VolumeChangerProps {}

export const VolumeChanger: React.FC<VolumeChangerProps> = () => {
  const [volume, setVolume] = useAtom(volumeAtom);
  return (
    <>
      <div style={{ marginTop: 16, marginBottom: 2 }}>volume: </div>
      <div>
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
    </>
  );
};

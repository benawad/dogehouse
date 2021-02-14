import React from "react";

interface VolumeSliderProps {
  label?: boolean;
  volume: number;
  onVolume: (n: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  label,
  volume,
  onVolume,
}) => {
  return (
    <div>
      {label ? "volume: " : ""}
      {volume}
      <input
        type="range"
        min="1"
        max="100"
        value={volume}
        onChange={(e) => {
          const n = parseInt(e.target.value);
          onVolume(n);
        }}
      />
    </div>
  );
};

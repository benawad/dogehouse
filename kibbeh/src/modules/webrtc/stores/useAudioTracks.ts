import create from "zustand";
import { combine } from "zustand/middleware";

export const useAudioTracks = create(
  combine(
    {
      tracks: [] as MediaStreamTrack[],
    },
    (set) => ({
      add: (track: MediaStreamTrack) =>
        set((s) => ({ tracks: [...s.tracks, track] })),
    })
  )
);

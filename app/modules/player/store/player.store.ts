import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PlayerState {
  // 持久化偏好设置
  zoom: number;
  volume: number;
  isShowFretboard: boolean;

  // 运行时状态 (不持久化)
  isPlaying: boolean;
  isLoading: boolean;

  // Actions
  setZoom: (zoom: number) => void;
  setVolume: (vol: number) => void;
  toggleFretboard: () => void;
  setIsPlaying: (status: boolean) => void;
  setIsLoading: (status: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      zoom: 100,
      volume: 100,
      isShowFretboard: true,
      isPlaying: false,
      isLoading: true,

      setZoom: (zoom) => set({ zoom }),
      setVolume: (volume) => set({ volume }),
      toggleFretboard: () =>
        set((state) => ({ isShowFretboard: !state.isShowFretboard })),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "blues-player-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        zoom: state.zoom,
        volume: state.volume,
        isShowFretboard: state.isShowFretboard,
      }),
    },
  ),
);

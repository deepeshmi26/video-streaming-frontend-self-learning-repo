import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWatchHistory = create(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (video) => {
        const exists = get().history.find((v) => v.id === video.id);
        if (!exists) set({ history: [...get().history, video] });
      },
      updateProgress: (id, progress) => {
        set({
          history: get().history.map((v) =>
            v.id === id ? { ...v, progress } : v
          ),
        });
      },
      clearHistory: () => set({ history: [] }),
    }),
    { name: "watch-history" }
  )
);

export default useWatchHistory;

import { create } from "zustand";

export interface GlobalStore {
    BPM: number;
    setBPM: (BPM: number) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
    BPM: 120,

    setBPM: (BPM) => set({ BPM }),
}));
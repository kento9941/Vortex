import { create } from "zustand";

export interface StrudelControls {
    play: (() => void) | null;
    stop: (() => void) | null;
    proc: (() => void | Promise<void>) | null; 
}

export interface StrudelStore extends StrudelControls {
    isPlaying: boolean;
    setControls: (controls: Partial<StrudelControls>) => void;
    setPlaying: (isPlaying: boolean) => void;
}

export const useStrudelStore = create<StrudelStore>((set) => ({
    play: null,
    stop: null,
    proc: null,
    isPlaying: false,

    setControls: (controls) => set(controls),
    setPlaying: (isPlaying) => set({ isPlaying })
}));
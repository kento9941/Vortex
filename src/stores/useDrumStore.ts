import { create } from "zustand";
import type { InstrumentSettings, DrumTrack } from "./types";

export interface GenericDrumData extends Record<string, any> {
    settings: InstrumentSettings;
}

export interface DrumState {
    settings: InstrumentSettings;
    hihat: DrumTrack;
    open_hihat: DrumTrack;
    snare_drum: DrumTrack;
    rim_shot: DrumTrack;
    low_tom: DrumTrack;
    middle_tom: DrumTrack;
    high_tom: DrumTrack;
    ride_cymbal: DrumTrack;
    crash_cymbal: DrumTrack;
    bass_drum: DrumTrack;
}

// helper types for strict typing of actions
export type DrumSectionName = keyof DrumState;
export type DrumTrackName = Exclude<DrumSectionName, "settings">;

export interface DrumStore {
    drum: DrumState;
    updateDrum: <K extends DrumSectionName>(name: K, updates: Partial<DrumState[K]>) => void;
    resetTrack: (track: DrumTrackName) => void;
    resetState: () => void;
    getDrumStr: () => string;
}

const createInitialTrack = (): DrumTrack => ({
    struct: Array.from({ length: 64 }, () => "~"),
    play: true,
    gain: 1
});

const initialDrumState: DrumState = {
    settings: {
        play: true,
        bank: "RolandTR808",
        slow: 2,
        gain: 1,
    },
    hihat: createInitialTrack(),
    open_hihat: createInitialTrack(),
    snare_drum: createInitialTrack(),
    rim_shot: createInitialTrack(),
    low_tom: createInitialTrack(),
    middle_tom: createInitialTrack(),
    high_tom: createInitialTrack(),
    ride_cymbal: createInitialTrack(),
    crash_cymbal: createInitialTrack(),
    bass_drum: createInitialTrack()
};

export const useDrumStore = create<DrumStore>((set, get) => ({
    drum: initialDrumState,

    updateDrum: (name, updates) => {
        set((state) => ({
            drum: {
                ...state.drum,
                [name]: { 
                    ...state.drum[name], 
                    ...updates 
                }
            }
        }));
    },

    resetTrack: (track) => {
        set((state) => {
            const structLength = state.drum[track].struct.length;
            const resetStruct = Array.from({ length: structLength }, () => "~");

            return {
                drum: {
                    ...state.drum,
                    [track]: {
                        ...state.drum[track],
                        struct: resetStruct,
                        play: true,
                        gain: 1,
                    },
                },
            };
        });
    },

    resetState: () => {
        set(() => ({
            drum: initialDrumState
        }));

        console.log("Reseted drum state");
    },

    getDrumStr: () => {
        const { drum } = get();

        if (!drum.settings.play) return "silence";

        const stack = Object.entries(drum)
            .filter(([name]) => name !== "settings")
            .map(([name, data]) => {
                const { struct, play, gain } = data as DrumTrack; 
                
                // mute track
                if (!play) {
                    return `// ${name} muted`;
                }
                
                return `s("${struct.join(" ")}").postgain(${gain})`;
            })
            .join(",\n    ");

        return `stack(
    ${stack})`;
    },
}));
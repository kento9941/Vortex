import { create } from "zustand";
import type { MelodicNoteData, MelodicTrackData, MelodicInstrumentData, MelodicTrackName } from "./types";

export interface GuitarStore {
    guitar: MelodicInstrumentData;
    updateGuitar: <K extends keyof MelodicInstrumentData>(name: K, updates: Partial<MelodicInstrumentData[K]>) => void;
    updateNote: (track: MelodicTrackName, index: number, updates: Partial<MelodicNoteData>) => void;
    resetTrack: (track: MelodicTrackName) => void;
    resetState: () => void;
    getGuitarStr: () => string;
}

// helper function to keep the initial state clean
const createInitialStruct = (): MelodicNoteData[] => 
    Array.from({ length: 64 }, () => ({
        note: "~",
        gain: 1,
        release: 1,
    }));

// apply the type to Zustand using create<GuitarStore>()((set, get) => ...)
export const useGuitarStore = create<GuitarStore>()((set, get) => ({
    guitar: {
        settings: {
            play: true,
            bank: "gm_acoustic_guitar_nylon", // Default sound bank updated to guitar
            slow: 2,
            gain: 1,
        },
        c: { struct: createInitialStruct(), play: true, gain: 1 },
        cs: { struct: createInitialStruct(), play: true, gain: 1 },
        d: { struct: createInitialStruct(), play: true, gain: 1 },
        ds: { struct: createInitialStruct(), play: true, gain: 1 },
        e: { struct: createInitialStruct(), play: true, gain: 1 },
        f: { struct: createInitialStruct(), play: true, gain: 1 },
        fs: { struct: createInitialStruct(), play: true, gain: 1 },
        g: { struct: createInitialStruct(), play: true, gain: 1 },
        gs: { struct: createInitialStruct(), play: true, gain: 1 },
        a: { struct: createInitialStruct(), play: true, gain: 1 },
        as: { struct: createInitialStruct(), play: true, gain: 1 },
        b: { struct: createInitialStruct(), play: true, gain: 1 }
    },

    updateGuitar: (name, updates) => {
        set((state) => ({
            guitar: {
                ...state.guitar,
                [name]: { ...(state.guitar[name] as any), ...(updates as any) }
            }
        }))
    },

    updateNote: (track, index, updates) => {
        set((state) => {
            const oldStruct = state.guitar[track].struct;
            const newStruct = oldStruct.map((obj, i) =>
                i === index ? { ...obj, ...updates } : obj
            );

            return {
                guitar: {
                    ...state.guitar,
                    [track]: {
                        ...state.guitar[track],
                        struct: newStruct
                    }
                }
            };
        });
    },

    resetTrack: (track) => {
        set((state) => {
            const structLength = state.guitar[track].struct.length;
            const resetStruct = Array.from({ length: structLength }, () => ({
                note: "~",
                gain: 1,
                release: 1,
            }));

            return {
                guitar: {
                    ...state.guitar,
                    [track]: {
                        ...state.guitar[track],
                        struct: resetStruct,
                        play: true,
                        gain: 1,
                    },
                },
            };
        });
    },

    resetState: () => {
        set({
            guitar: {
                settings: {
                    play: false,
                    bank: "gm_acoustic_guitar_nylon",
                    slow: 2,
                    gain: 1,
                },
                c: { struct: createInitialStruct(), play: true, gain: 1 },
                cs: { struct: createInitialStruct(), play: true, gain: 1 },
                d: { struct: createInitialStruct(), play: true, gain: 1 },
                ds: { struct: createInitialStruct(), play: true, gain: 1 },
                e: { struct: createInitialStruct(), play: true, gain: 1 },
                f: { struct: createInitialStruct(), play: true, gain: 1 },
                fs: { struct: createInitialStruct(), play: true, gain: 1 },
                g: { struct: createInitialStruct(), play: true, gain: 1 },
                gs: { struct: createInitialStruct(), play: true, gain: 1 },
                a: { struct: createInitialStruct(), play: true, gain: 1 },
                as: { struct: createInitialStruct(), play: true, gain: 1 },
                b: { struct: createInitialStruct(), play: true, gain: 1 },
            }
        });

        console.log("Reset guitar state");
    },

    getGuitarStr: () => {
        const { guitar } = get();
        const guitarBank = guitar.settings.bank;

        if (!guitar.settings.play) return `seq(["~"])`;

        const stack = (Object.entries(guitar) as [keyof MelodicInstrumentData, any][])
            .filter(([name]) => name !== "settings")
            .map(([name, trackData]: [keyof MelodicInstrumentData, MelodicTrackData]) => {

                if (!trackData.play) {
                    return `// ${String(name)} muted`;
                }

                let seq = "seq([" +
                    trackData.struct.map((obj: MelodicNoteData) =>
                        obj.note === "~"
                            ? `"~"`
                            : `makeNote("${obj.note}", "${guitarBank}", ${obj.gain * trackData.gain}, ${obj.release})`
                    ).join(", ") +
                    "])";

                return seq;
            })
            .join(",\n    ");

        return `stack(\n        ${stack})`;
    },
}));
import { create } from "zustand";
import type { MelodicNoteData, MelodicTrackData, MelodicInstrumentData, MelodicTrackName } from "./types";

export interface SynthStore {
    synth: MelodicInstrumentData;
    updateSynth: <K extends keyof MelodicInstrumentData>(name: K, updates: Partial<MelodicInstrumentData[K]>) => void;
    updateNote: (track: MelodicTrackName, index: number, updates: Partial<MelodicNoteData>) => void;
    resetTrack: (track: MelodicTrackName) => void;
    resetState: () => void;
    getSynthStr: () => string;
}

// helper function to keep the initial state clean
const createInitialStruct = (): MelodicNoteData[] => 
    Array.from({ length: 64 }, () => ({
        note: "~",
        gain: 1,
        release: 1,
    }));

// apply the type to Zustand using create<SynthStore>()((set, get) => ...)
export const useSynthStore = create<SynthStore>()((set, get) => ({
    synth: {
        settings: {
            play: true,
            bank: "saw", // Default sound bank updated to synth
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

    updateSynth: (name, updates) => {
        set((state) => ({
            synth: {
                ...state.synth,
                [name]: { ...(state.synth[name] as any), ...(updates as any) }
            }
        }))
    },

    updateNote: (track, index, updates) => {
        set((state) => {
            const oldStruct = state.synth[track].struct;
            const newStruct = oldStruct.map((obj, i) =>
                i === index ? { ...obj, ...updates } : obj
            );

            return {
                synth: {
                    ...state.synth,
                    [track]: {
                        ...state.synth[track],
                        struct: newStruct
                    }
                }
            };
        });
    },

    resetTrack: (track) => {
        set((state) => {
            const structLength = state.synth[track].struct.length;
            const resetStruct = Array.from({ length: structLength }, () => ({
                note: "~",
                gain: 1,
                release: 1,
            }));

            return {
                synth: {
                    ...state.synth,
                    [track]: {
                        ...state.synth[track],
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
            synth: {
                settings: {
                    play: false,
                    bank: "saw",
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

        console.log("Reset synth state");
    },

    getSynthStr: () => {
        const { synth } = get();
        const synthBank = synth.settings.bank;

        if (!synth.settings.play) return `seq(["~"])`;

        const stack = (Object.entries(synth) as [keyof MelodicInstrumentData, any][])
            .filter(([name]) => name !== "settings")
            .map(([name, trackData]: [keyof MelodicInstrumentData, MelodicTrackData]) => {

                if (!trackData.play) {
                    return `// ${String(name)} muted`;
                }

                let seq = "seq([" +
                    trackData.struct.map((obj: MelodicNoteData) =>
                        obj.note === "~"
                            ? `"~"`
                            : `makeNote("${obj.note}", "${synthBank}", ${obj.gain * trackData.gain}, ${obj.release})`
                    ).join(", ") +
                    "])";

                return seq;
            })
            .join(",\n    ");

        return `stack(\n        ${stack})`;
    },
}));
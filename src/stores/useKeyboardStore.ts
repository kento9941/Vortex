import { create } from "zustand";
import type { MelodicNoteData, MelodicTrackData, MelodicInstrumentData, MelodicTrackName } from "./types";

interface KeyboardStore {
    keyboard: MelodicInstrumentData;
    updateKeyboard: <K extends keyof MelodicInstrumentData>(name: K, updates: Partial<MelodicInstrumentData[K]>) => void;
    updateNote: (track: MelodicTrackName, index: number, updates: Partial<MelodicNoteData>) => void;
    resetTrack: (track: MelodicTrackName) => void;
    resetState: () => void;
    getKeyboardStr: () => string;
}

// helper function to keep the initial state clean
const createInitialStruct = (): MelodicNoteData[] => 
    Array.from({ length: 64 }, () => ({
        note: "~",
        gain: 1,
        release: 1,
    }));

// apply the type to Zustand using create<KeyboardStore>()((set, get) => ...)
export const useKeyboardStore = create<KeyboardStore>()((set, get) => ({
    keyboard: {
        settings: {
            play: true,
            bank: "gm_piano",
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

    updateKeyboard: (name, updates) => {
        set((state) => ({
            keyboard: {
                ...state.keyboard,
                [name]: { ...(state.keyboard[name] as any), ...(updates as any) }
            }
        }))
    },

    updateNote: (track, index, updates) => {
        set((state) => {
            const oldStruct = state.keyboard[track].struct;
            const newStruct = oldStruct.map((obj, i) =>
                i === index ? { ...obj, ...updates } : obj
            );

            return {
                keyboard: {
                    ...state.keyboard,
                    [track]: {
                        ...state.keyboard[track],
                        struct: newStruct
                    }
                }
            };
        });
    },

    resetTrack: (track) => {
        set((state) => {
            const structLength = state.keyboard[track].struct.length;
            const resetStruct = Array.from({ length: structLength }, () => ({
                note: "~",
                gain: 1,
                release: 1,
            }));

            return {
                keyboard: {
                    ...state.keyboard,
                    [track]: {
                        ...state.keyboard[track],
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
            keyboard: {
                settings: {
                    play: false,
                    bank: "gm_piano",
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

        console.log("Reset keyboard state");
    },

    getKeyboardStr: () => {
        const { keyboard } = get();
        const keyboardBank = keyboard.settings.bank;

        if (!keyboard.settings.play) return `seq(["~"])`;

        const stack = (Object.entries(keyboard) as [keyof MelodicInstrumentData, any][])
            .filter(([name]) => name !== "settings")
            .map(([name, trackData]: [keyof MelodicInstrumentData, MelodicTrackData]) => {

                if (!trackData.play) {
                    return `// ${String(name)} muted`;
                }

                let seq = "seq([" +
                    trackData.struct.map((obj: MelodicNoteData) =>
                        obj.note === "~"
                            ? `"~"`
                            : `makeNote("${obj.note}", "${keyboardBank}", ${obj.gain * trackData.gain}, ${obj.release})`
                    ).join(", ") +
                    "])";

                return seq;
            })
            .join(",\n    ");

        return `stack(\n        ${stack})`;
    },
}));
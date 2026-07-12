import { create } from "zustand";

export interface NoteData {
    note: string;
    gain: number;
    release: number;
}

export interface TrackData {
    struct: NoteData[];
    play: boolean;
    gain: number;
}

export interface KeyboardSettings {
    play: boolean;
    bank: string;
    slow: number;
    gain: number;
}

// restrict track names to exactly the keys you use to prevent typos
export type TrackName = "c" | "cs" | "d" | "ds" | "e" | "f" | "fs" | "g" | "gs" | "a" | "as" | "b";

export interface KeyboardData extends Record<TrackName, TrackData> {
    settings: KeyboardSettings;
}

export interface KeyboardStore {
    keyboard: KeyboardData;
    updateKeyboard: <K extends keyof KeyboardData>(name: K, updates: Partial<KeyboardData[K]>) => void;
    updateNote: (track: TrackName, index: number, updates: Partial<NoteData>) => void;
    resetTrack: (track: TrackName) => void;
    resetState: () => void;
    getKeyboardStr: () => string;
}

// helper function to keep the initial state clean
const createInitialStruct = (): NoteData[] => 
    Array.from({ length: 32 }, () => ({
        note: "~",
        gain: 1,
        release: 1,
    }));

// apply the type to Zustand using create<KeyboardStore>()((set, get) => ...)
export const useKeyboardStore = create<KeyboardStore>()((set, get) => ({
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

        const stack = (Object.entries(keyboard) as [keyof KeyboardData, any][])
            .filter(([name]) => name !== "settings")
            .map(([name, trackData]: [keyof KeyboardData, TrackData]) => {

                if (!trackData.play) {
                    return `// ${String(name)} muted`;
                }

                let seq = "seq([" +
                    trackData.struct.map((obj: NoteData) =>
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
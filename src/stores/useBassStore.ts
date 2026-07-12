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

export interface BassSettings {
    play: boolean;
    bank: string;
    slow: number;
    gain: number;
}

// restrict track names to exactly the keys you use to prevent typos
export type TrackName = "c" | "cs" | "d" | "ds" | "e" | "f" | "fs" | "g" | "gs" | "a" | "as" | "b";

export interface BassData extends Record<TrackName, TrackData> {
    settings: BassSettings;
}

export interface BassStore {
    bass: BassData;
    updateBass: <K extends keyof BassData>(name: K, updates: Partial<BassData[K]>) => void;
    updateNote: (track: TrackName, index: number, updates: Partial<NoteData>) => void;
    resetTrack: (track: TrackName) => void;
    resetState: () => void;
    getBassStr: () => string;
}

// helper function to keep the initial state clean
const createInitialStruct = (): NoteData[] => 
    Array.from({ length: 32 }, () => ({
        note: "~",
        gain: 1,
        release: 1,
    }));

// apply the type to Zustand using create<BassStore>()((set, get) => ...)
export const useBassStore = create<BassStore>()((set, get) => ({
    bass: {
        settings: {
            play: false,
            bank: "gm_acoustic_bass", // Default sound bank updated to bass
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

    updateBass: (name, updates) => {
        set((state) => ({
            bass: {
                ...state.bass,
                [name]: { ...(state.bass[name] as any), ...(updates as any) }
            }
        }))
    },

    updateNote: (track, index, updates) => {
        set((state) => {
            const oldStruct = state.bass[track].struct;
            const newStruct = oldStruct.map((obj, i) =>
                i === index ? { ...obj, ...updates } : obj
            );

            return {
                bass: {
                    ...state.bass,
                    [track]: {
                        ...state.bass[track],
                        struct: newStruct
                    }
                }
            };
        });
    },

    resetTrack: (track) => {
        set((state) => {
            const structLength = state.bass[track].struct.length;
            const resetStruct = Array.from({ length: structLength }, () => ({
                note: "~",
                gain: 1,
                release: 1,
            }));

            return {
                bass: {
                    ...state.bass,
                    [track]: {
                        ...state.bass[track],
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
            bass: {
                settings: {
                    play: false,
                    bank: "gm_acoustic_bass",
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

        console.log("Reset bass state");
    },

    getBassStr: () => {
        const { bass } = get();
        const bassBank = bass.settings.bank;

        if (!bass.settings.play) return `seq(["~"])`;

        const stack = (Object.entries(bass) as [keyof BassData, any][])
            .filter(([name]) => name !== "settings")
            .map(([name, trackData]: [keyof BassData, TrackData]) => {

                if (!trackData.play) {
                    return `// ${String(name)} muted`;
                }

                let seq = "seq([" +
                    trackData.struct.map((obj: NoteData) =>
                        obj.note === "~"
                            ? `"~"`
                            : `makeNote("${obj.note}", "${bassBank}", ${obj.gain * trackData.gain}, ${obj.release})`
                    ).join(", ") +
                    "])";

                return seq;
            })
            .join(",\n    ");

        return `stack(\n        ${stack})`;
    },
}));
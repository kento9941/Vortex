export interface InstrumentSettings {
    play: boolean;
    bank: string;
    slow: number;
    gain: number;
}

// -----------------------------------
// melodic instruments
export interface MelodicInstrumentSettings extends InstrumentSettings {}

export interface MelodicNoteData {
    note: string;
    gain: number;
    release: number;
}

export interface MelodicTrackData {
    struct: MelodicNoteData[];
    play: boolean;
    gain: number;
}

export type MelodicTrackName = "c" | "cs" | "d" | "ds" | "e" | "f" | "fs" | "g" | "gs" | "a" | "as" | "b";

export interface MelodicInstrumentData extends Record<MelodicTrackName, MelodicTrackData> {
    settings: MelodicInstrumentSettings;
}

// ----------------------------------
// drums
export interface DrumSettings extends InstrumentSettings {}

export interface DrumTrack {
    struct: string[];
    play: boolean;
    gain: number;
}
import type { MelodicNoteData, MelodicTrackData, MelodicInstrumentData, InstrumentSettings, DrumTrack } from "../../stores/types"

// -------------------------------------------
// add 16 structural note steps to all tracks for Guitar, Keyboard, Synth, Bass
export const addBar = <T extends MelodicInstrumentData>({ 
    instrument, 
    update 
}: {
    instrument: T;
    update: <K extends keyof T>(name: K, updates: Partial<T[K]>) => void;
}): void => {
    Object.entries(instrument).forEach(([name, inst]) => {
        if (name === "settings") return;

        const track = inst as MelodicTrackData;
        const newSteps: MelodicNoteData[] = Array.from({ length: 16 }, () => ({
            note: "~",
            gain: 1,
            release: 1,
        }));

        const newStruct = [...track.struct, ...newSteps];
        update(name as keyof T, { struct: newStruct } as any);
    });

    const newSlow = instrument.settings.slow + 1;
    update("settings", { slow: newSlow } as any);
}


// -------------------------------------------
// add 16 "~" to all tracks for Drum
export interface GenericDrumData extends Record<string, any> {
    settings: InstrumentSettings;
}

export const addDrumBar = <T extends GenericDrumData>({
    instrument,
    update
}: {
    instrument: T;
    update: <K extends keyof T>(name: K, updates: Partial<T[K]>) => void;
}): void => {
    Object.entries(instrument).forEach(([name, inst]) => {
        if (name === "settings") return;

        const track = inst as DrumTrack;
        const newStruct = [...track.struct, ...Array(16).fill("~")];

        update(name as keyof T, { struct: newStruct } as any);
    });

    const newSlow = instrument.settings.slow + 1;
    update("settings", { slow: newSlow } as any);
}

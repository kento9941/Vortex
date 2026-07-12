export interface GenericNote {
    note: string;
    gain: number;
    release: number;
}

export interface GenericTrack {
    struct: GenericNote[];
    play: boolean;
    gain: number;
}

export interface GenericSettings {
    play: boolean;
    bank: string;
    slow: number;
    gain: number;
}

export interface GenericInstrumentData extends Record<string, any> {
    settings: GenericSettings;
}

// Drum structural types
export interface GenericDrumTrack {
    struct: string[];
    play: boolean;
    gain: number;
}

export interface GenericDrumData extends Record<string, any> {
    settings: GenericSettings;
}

// -------------------------------------------
// add 16 structural note steps to all tracks for Guitar, Keyboard, Synth, Bass
export const addBar = <T extends GenericInstrumentData>({ 
    instrument, 
    update 
}: {
    instrument: T;
    update: <K extends keyof T>(name: K, updates: Partial<T[K]>) => void;
}): void => {
    Object.entries(instrument).forEach(([name, inst]) => {
        if (name === "settings") return;

        const track = inst as GenericTrack;
        const newSteps: GenericNote[] = Array.from({ length: 16 }, () => ({
            note: "~",
            gain: 1,
            release: 1,
        }));

        const newStruct = [...track.struct, ...newSteps];
        update(name as keyof T, { struct: newStruct } as any);
    });

    const newSlow = instrument.settings.slow + 1;
    update("settings", { slow: newSlow } as any);
};

// -------------------------------------------
// add 16 "~" to all tracks for Drum
export const addDrumBar = <T extends GenericDrumData>({
    instrument,
    update
}: {
    instrument: T;
    update: <K extends keyof T>(name: K, updates: Partial<T[K]>) => void;
}): void => {
    Object.entries(instrument).forEach(([name, inst]) => {
        if (name === "settings") return;

        const track = inst as GenericDrumTrack;
        // Correctly mirrors your array generation style for string steps
        const newStruct = [...track.struct, ...Array(16).fill("~")];
        
        update(name as keyof T, { struct: newStruct } as any);
    });

    const newSlow = instrument.settings.slow + 1;
    update("settings", { slow: newSlow } as any);
};
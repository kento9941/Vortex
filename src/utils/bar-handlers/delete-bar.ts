// define the minimum required structure for the function to work
export interface DeletableSettings {
    slow: number;
}

export interface DeletableInstrumentData extends Record<string, any> {
    settings: DeletableSettings;
}

export interface DeleteBarArgs<T extends DeletableInstrumentData> {
    instrument: T;
    update: <K extends keyof T>(name: K, updates: Partial<T[K]>) => void;
}

export const deleteBar = <T extends DeletableInstrumentData>({ 
    instrument, 
    update 
}: DeleteBarArgs<T>): void => {
    // safely find the struct length of the first valid track
    const firstTrack = Object.values(instrument).find((d: any) => d && Array.isArray(d.struct));
    const structLength = firstTrack?.struct?.length ?? 0;

    // prevent deletion below the minimum 32 steps (2 bars)
    if (structLength <= 32) {
        return;
    }

    // delete one bar (16 steps) from every track component
    Object.entries(instrument).forEach(([name, inst]) => {
        if (name === "settings") return;

        // safety check: skip any future properties that aren't tracks
        if (!inst || !Array.isArray(inst.struct)) return;

        const newStruct = inst.struct.slice(0, -16);
        update(name as keyof T, { struct: newStruct } as any);
    });

    // decrease the strudel timing variable
    const newSlow = instrument.settings.slow - 1;
    update("settings" as keyof T, { slow: newSlow } as any);

};
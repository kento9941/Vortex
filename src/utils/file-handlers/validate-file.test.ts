import { describe, it, expect } from "vitest";
import { useKeyboardStore } from "../../stores/useKeyboardStore";
import { useDrumStore } from "../../stores/useDrumStore";
import {
    isValidMelodicInstrument,
    isValidDrumState,
    isValidSequencerFileData,
    type SequencerFileData,
} from "./validate-file";

const validKeyboard = () => structuredClone(useKeyboardStore.getState().keyboard);
const validDrum = () => structuredClone(useDrumStore.getState().drum);

const validFileData = (): SequencerFileData => ({
    keyboard: validKeyboard(),
    guitar: validKeyboard(),
    bass: validKeyboard(),
    synth: validKeyboard(),
    drum: validDrum(),
    bpm: 120,
});

describe("isValidMelodicInstrument", () => {
    it("accepts a well-formed instrument", () => {
        expect(isValidMelodicInstrument(validKeyboard())).toBe(true);
    });

    it("rejects a missing track", () => {
        const data = validKeyboard();
        delete (data as any).c;
        expect(isValidMelodicInstrument(data)).toBe(false);
    });

    it("rejects a note missing a required field", () => {
        const data = validKeyboard();
        delete (data.c.struct[0] as any).release;
        expect(isValidMelodicInstrument(data)).toBe(false);
    });

    it("rejects a note with the wrong field type", () => {
        const data = validKeyboard();
        (data.c.struct[0] as any).gain = "loud";
        expect(isValidMelodicInstrument(data)).toBe(false);
    });

    it("rejects malformed settings", () => {
        const data = validKeyboard();
        (data.settings as any).play = "yes";
        expect(isValidMelodicInstrument(data)).toBe(false);
    });

    it("rejects non-object input", () => {
        expect(isValidMelodicInstrument(null)).toBe(false);
        expect(isValidMelodicInstrument([])).toBe(false);
    });
});

describe("isValidDrumState", () => {
    it("accepts a well-formed drum state", () => {
        expect(isValidDrumState(validDrum())).toBe(true);
    });

    it("rejects a missing drum track", () => {
        const data = validDrum();
        delete (data as any).snare_drum;
        expect(isValidDrumState(data)).toBe(false);
    });

    it("rejects a struct containing a non-string step", () => {
        const data = validDrum();
        (data.hihat.struct as any)[0] = 5;
        expect(isValidDrumState(data)).toBe(false);
    });
});

describe("isValidSequencerFileData", () => {
    it("accepts a complete, well-formed file", () => {
        expect(isValidSequencerFileData(validFileData())).toBe(true);
    });

    it("rejects a file missing a top-level instrument", () => {
        const data = validFileData();
        delete (data as any).synth;
        expect(isValidSequencerFileData(data)).toBe(false);
    });

    it("rejects bpm of the wrong type", () => {
        const data: any = validFileData();
        data.bpm = "120";
        expect(isValidSequencerFileData(data)).toBe(false);
    });

    it("rejects a file where a top-level key exists but is structurally corrupt", () => {
        // this is exactly what the old `if (!data.keyboard...)` check missed
        const data: any = validFileData();
        data.drum = { settings: data.drum.settings };
        expect(isValidSequencerFileData(data)).toBe(false);
    });
});

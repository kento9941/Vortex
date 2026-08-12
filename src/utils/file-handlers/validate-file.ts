import type { MelodicInstrumentData, MelodicNoteData, MelodicTrackData } from "../../stores/types";
import type { DrumState } from "../../stores/useDrumStore";

export interface SequencerFileData {
    keyboard: MelodicInstrumentData;
    guitar: MelodicInstrumentData;
    bass: MelodicInstrumentData;
    synth: MelodicInstrumentData;
    drum: DrumState;
    bpm: number;
}

const MELODIC_TRACK_NAMES = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"] as const;
const DRUM_TRACK_NAMES = [
    "hihat", "open_hihat", "snare_drum", "rim_shot", "low_tom",
    "middle_tom", "high_tom", "ride_cymbal", "crash_cymbal", "bass_drum",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidSettings(value: unknown): boolean {
    if (!isRecord(value)) return false;
    return (
        typeof value.play === "boolean" &&
        typeof value.bank === "string" &&
        typeof value.slow === "number" &&
        typeof value.gain === "number"
    );
}

function isValidMelodicNote(value: unknown): value is MelodicNoteData {
    if (!isRecord(value)) return false;
    return (
        typeof value.note === "string" &&
        typeof value.gain === "number" &&
        typeof value.release === "number"
    );
}

function isValidMelodicTrack(value: unknown): value is MelodicTrackData {
    if (!isRecord(value)) return false;
    return (
        Array.isArray(value.struct) &&
        value.struct.length > 0 &&
        value.struct.every(isValidMelodicNote) &&
        typeof value.play === "boolean" &&
        typeof value.gain === "number"
    );
}

export function isValidMelodicInstrument(value: unknown): value is MelodicInstrumentData {
    if (!isRecord(value)) return false;
    if (!isValidSettings(value.settings)) return false;
    return MELODIC_TRACK_NAMES.every((name) => isValidMelodicTrack(value[name]));
}

function isValidDrumTrack(value: unknown): boolean {
    if (!isRecord(value)) return false;
    return (
        Array.isArray(value.struct) &&
        value.struct.length > 0 &&
        value.struct.every((s) => typeof s === "string") &&
        typeof value.play === "boolean" &&
        typeof value.gain === "number"
    );
}

export function isValidDrumState(value: unknown): value is DrumState {
    if (!isRecord(value)) return false;
    if (!isValidSettings(value.settings)) return false;
    return DRUM_TRACK_NAMES.every((name) => isValidDrumTrack(value[name]));
}

export function debugValidateMelodicInstrument(value: unknown, label: string): void {
    if (!isRecord(value)) {
        console.error(`❌ ${label}: not an object`);
        return;
    }
    console.log(`--- ${label} ---`);
    console.log(isValidSettings(value.settings) ? "✅ settings" : "❌ settings FAILED", value.settings);

    MELODIC_TRACK_NAMES.forEach((name) => {
        const track = value[name];
        if (!isRecord(track)) {
            console.log(`❌ ${label}.${name}: not an object`, track);
            return;
        }
        if (!Array.isArray(track.struct) || track.struct.length === 0) {
            console.log(`❌ ${label}.${name}.struct: invalid or empty`, track.struct);
            return;
        }
        const badIndex = (track.struct as unknown[]).findIndex((n) => !isValidMelodicNote(n));
        if (badIndex !== -1) {
            console.log(`❌ ${label}.${name}.struct[${badIndex}]: invalid note`, track.struct[badIndex]);
            return;
        }
        if (typeof track.play !== "boolean") {
            console.log(`❌ ${label}.${name}.play`, track.play);
            return;
        }
        if (typeof track.gain !== "number") {
            console.log(`❌ ${label}.${name}.gain`, track.gain);
            return;
        }
        console.log(`✅ ${label}.${name}`);
    });
}

export function debugValidateSequencerFileData(value: unknown): void {
    if (!isRecord(value)) {
        console.error("❌ top-level value is not an object");
        return;
    }
    const checks: [string, boolean][] = [
        ["keyboard", isValidMelodicInstrument(value.keyboard)],
        ["guitar", isValidMelodicInstrument(value.guitar)],
        ["bass", isValidMelodicInstrument(value.bass)],
        ["synth", isValidMelodicInstrument(value.synth)],
        ["drum", isValidDrumState(value.drum)],
        ["bpm", typeof value.bpm === "number"],
    ];
    checks.forEach(([name, ok]) => {
        console.log(ok ? `✅ ${name}` : `❌ ${name} FAILED`);
    });
}

export function isValidSequencerFileData(value: unknown): value is SequencerFileData {
    if (!isRecord(value)) return false;
    return (
        isValidMelodicInstrument(value.keyboard) &&
        isValidMelodicInstrument(value.guitar) &&
        isValidMelodicInstrument(value.bass) &&
        isValidMelodicInstrument(value.synth) &&
        isValidDrumState(value.drum) &&
        typeof value.bpm === "number"
    );
}

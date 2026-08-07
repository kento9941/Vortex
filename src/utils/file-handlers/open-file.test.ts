import { describe, it, expect, vi, beforeEach } from "vitest";
import open from "./open-file";
import { useKeyboardStore } from "../../stores/useKeyboardStore";
import { useGuitarStore } from "../../stores/useGuitarStore";
import { useBassStore } from "../../stores/useBassStore";
import { useSynthStore } from "../../stores/useSynthStore";
import { useDrumStore } from "../../stores/useDrumStore";
import { useGlobalStore } from "../../stores/useGlobalStore";

function makeFile(contents: string): File {
    return { text: async () => contents } as unknown as File;
}

function snapshotState() {
    return {
        keyboard: useKeyboardStore.getState().keyboard,
        guitar: useGuitarStore.getState().guitar,
        bass: useBassStore.getState().bass,
        synth: useSynthStore.getState().synth,
        drum: useDrumStore.getState().drum,
        bpm: useGlobalStore.getState().BPM,
    };
}

function validFileData() {
    return {
        keyboard: structuredClone(useKeyboardStore.getState().keyboard),
        guitar: structuredClone(useGuitarStore.getState().guitar),
        bass: structuredClone(useBassStore.getState().bass),
        synth: structuredClone(useSynthStore.getState().synth),
        drum: structuredClone(useDrumStore.getState().drum),
        bpm: 140,
    };
}

beforeEach(() => {
    useKeyboardStore.getState().resetState();
    useGuitarStore.getState().resetState();
    useBassStore.getState().resetState();
    useSynthStore.getState().resetState();
    useDrumStore.getState().resetState();
    useGlobalStore.setState({ BPM: 120 });
});

describe("open", () => {
    it("loads a valid file into every store", async () => {
        const data = validFileData();
        await open(makeFile(JSON.stringify(data)));

        expect(useKeyboardStore.getState().keyboard).toEqual(data.keyboard);
        expect(useGuitarStore.getState().guitar).toEqual(data.guitar);
        expect(useBassStore.getState().bass).toEqual(data.bass);
        expect(useSynthStore.getState().synth).toEqual(data.synth);
        expect(useDrumStore.getState().drum).toEqual(data.drum);
        expect(useGlobalStore.getState().BPM).toBe(140);
    });

    it("leaves every store untouched when a top-level key is missing", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const before = snapshotState();

        const data: any = validFileData();
        delete data.drum;
        await open(makeFile(JSON.stringify(data)));

        expect(snapshotState()).toEqual(before);
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });

    it("leaves every store untouched when a nested field is structurally corrupt", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const before = snapshotState();

        const data = validFileData();
        (data.keyboard.c.struct[0] as any).gain = "loud";
        await open(makeFile(JSON.stringify(data)));

        expect(snapshotState()).toEqual(before);
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });

    it("leaves every store untouched when the file isn't valid JSON", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const before = snapshotState();

        await open(makeFile("{ not json"));

        expect(snapshotState()).toEqual(before);
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
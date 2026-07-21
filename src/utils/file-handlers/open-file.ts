import { useKeyboardStore } from "../../stores/useKeyboardStore";
import { useGuitarStore } from "../../stores/useGuitarStore";
import { useBassStore } from "../../stores/useBassStore";
import { useSynthStore } from "../../stores/useSynthStore";
import { useDrumStore } from "../../stores/useDrumStore";
import { useGlobalStore } from "../../stores/useGlobalStore";
import type { DrumState } from "../../stores/useDrumStore";
import type { MelodicInstrumentData } from "../../stores/types";

interface SequencerFileData {
    keyboard: MelodicInstrumentData;
    guitar: MelodicInstrumentData;
    bass: MelodicInstrumentData;
    synth: MelodicInstrumentData;
    drum: DrumState;
    bpm: number;
}

export default async function open(file: File): Promise<void> {
    try {
        // read the file directly as text without FileReader boilerplate
        const text = await file.text();
        const data: SequencerFileData = JSON.parse(text);

        if (!data.keyboard || !data.guitar || !data.bass || !data.synth || !data.drum) {
            throw new Error("Invalid file structure");
        }

        useKeyboardStore.setState({ keyboard: data.keyboard });
        useGuitarStore.setState({ guitar: data.guitar });
        useBassStore.setState({ bass: data.bass });
        useSynthStore.setState({ synth: data.synth });
        useDrumStore.setState({ drum: data.drum });
        useGlobalStore.setState({ BPM: data.bpm });

        console.log("Successfully opened JSON file");
    } catch (err) {
        console.error("Failed to open or parse file:", err);
    }
}
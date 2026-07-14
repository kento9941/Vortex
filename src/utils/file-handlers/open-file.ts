import { useKeyboardStore } from "../../stores/useKeyboardStore";
import { useGuitarStore } from "../../stores/useGuitarStore";
import { useBassStore } from "../../stores/useBassStore";
import { useSynthStore } from "../../stores/useSynthStore";
import { useDrumStore } from "../../stores/useDrumStore";
import type { DrumState } from "../../stores/useDrumStore";
import type { MelodicInstrumentData } from "../../stores/types";

interface SequencerFileData {
    keyboard: MelodicInstrumentData;
    guitar: MelodicInstrumentData;
    bass: MelodicInstrumentData;
    synth: MelodicInstrumentData;
    drum: DrumState;
}

export default async function open(
    event: React.ChangeEvent<HTMLInputElement>
): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
            const result = e.target?.result;
            if (typeof result !== "string") {
                throw new Error("File could not be read as text");
            }

            const data: SequencerFileData = JSON.parse(result);

            // runtime safety check
            if (!data.keyboard || !data.guitar || !data.bass || !data.synth || !data.drum) {
                throw new Error("Invalid file structure");
            }

            useKeyboardStore.setState({ keyboard: data.keyboard });
            useGuitarStore.setState({ guitar: data.guitar });
            useBassStore.setState({ bass: data.bass });
            useSynthStore.setState({ synth: data.synth });
            useDrumStore.setState({ drum: data.drum });

            console.log("Successfully opened JSON file");
        } catch (err) {
            console.error("Something went wrong:", err);
        }
    };

    reader.readAsText(file);
}
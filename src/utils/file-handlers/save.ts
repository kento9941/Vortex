import { useGlobalStore } from "../../stores/useGlobalStore";
import { useKeyboardStore } from "../../stores/useKeyboardStore";
import { useGuitarStore } from "../../stores/useGuitarStore";
import { useBassStore } from "../../stores/useBassStore";
import { useSynthStore } from "../../stores/useSynthStore";
import { useDrumStore } from "../../stores/useDrumStore";

export default async function save() {
    // get state from all stores
    const bass = useBassStore.getState().bass;
    const drum = useDrumStore.getState().drum;
    const guitar = useGuitarStore.getState().guitar;
    const keyboard = useKeyboardStore.getState().keyboard;
    const synth = useSynthStore.getState().synth;
    const bpm = useGlobalStore.getState().BPM;

    // create the state object using keys that match the stores
    const state = { 
        bass, 
        drum, 
        guitar, 
        keyboard, 
        synth, 
        bpm 
    };

    const jsonString = JSON.stringify(state, null, 2);

    try {
        // @ts-ignore - showSaveFilePicker is not in all TS definitions yet
        const handle = await window.showSaveFilePicker({
            suggestedName: 'project.json',
            types: [{
                description: "JSON file",
                accept: {"application/json": [".json"]},
            }],
        });

        const writable = await handle.createWritable();
        await writable.write(jsonString);
        await writable.close();

        console.log("Successfully saved file.");
    }
    catch (err: any) {
        // ignore AbortError if user closes the save dialog
        if (err.name !== 'AbortError') {
            console.error("Something went wrong:", err);
        }
    }
}
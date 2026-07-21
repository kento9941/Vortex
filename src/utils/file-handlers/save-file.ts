import { useGlobalStore } from "../../stores/useGlobalStore";
import { useKeyboardStore } from "../../stores/useKeyboardStore";
import { useGuitarStore } from "../../stores/useGuitarStore";
import { useBassStore } from "../../stores/useBassStore";
import { useSynthStore } from "../../stores/useSynthStore";
import { useDrumStore } from "../../stores/useDrumStore";

export default async function save() {
    const bass = useBassStore.getState().bass;
    const drum = useDrumStore.getState().drum;
    const guitar = useGuitarStore.getState().guitar;
    const keyboard = useKeyboardStore.getState().keyboard;
    const synth = useSynthStore.getState().synth;
    const bpm = useGlobalStore.getState().BPM;

    const state = { 
        bass,
        drum,
        guitar,
        keyboard,
        synth,
        bpm
    };

    const jsonString = JSON.stringify(state, null, 2);

    // modern Chrome/Edge path (Native file picker)
    if ("showSaveFilePicker" in window) {
        try {
            // @ts-ignore
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
            return;
        } catch (err: any) {
            // ignore AbortError if user closes the save dialog
            if (err.name !== 'AbortError') {
                console.error("Something went wrong:", err);
            }
            return;
        }
    }

    // fallback path (Firefox / Safari / Mobile)
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = "project.json";
    document.body.appendChild(link);
    link.click();
    
    // clean up DOM and memory
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log("Successfully downloaded file via fallback.");
}
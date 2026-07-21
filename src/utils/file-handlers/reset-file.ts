import { useKeyboardStore } from "../../stores/useKeyboardStore";
import { useGuitarStore } from "../../stores/useGuitarStore";
import { useBassStore } from "../../stores/useBassStore";
import { useSynthStore } from "../../stores/useSynthStore";
import { useDrumStore } from "../../stores/useDrumStore";

export default function reset() {
    try {
        useKeyboardStore.getState().resetState?.();
        useGuitarStore.getState().resetState?.();
        useBassStore.getState().resetState?.();
        useSynthStore.getState().resetState?.();
        useDrumStore.getState().resetState?.();
        console.log("Successfully reset all states.");
    } catch (err) {
        console.error("Failed to reset one or more stores:", err);
    }
}
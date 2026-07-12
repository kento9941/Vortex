import { useGlobalStore } from "../stores/useGlobalStore";
import { useKeyboardStore } from "../stores/useKeyboardStore";
import { useGuitarStore } from "../stores/useGuitarStore";
import { useBassStore } from "../stores/useBassStore";
import { useSynthStore } from "../stores/useSynthStore";
import { useDrumStore } from "../stores/useDrumStore";

export const MyTunes = () => {
    // global settings
    const globalState = useGlobalStore.getState();
    const BPM = globalState.BPM;

    // keyboard
    const keyboardState = useKeyboardStore.getState();
    const keyboardStack = keyboardState.getKeyboardStr();
    const keyboardSlow = keyboardState.keyboard.settings.slow;
    const keyboardGain = keyboardState.keyboard.settings.gain;

    // guitar
    const guitarState = useGuitarStore.getState();
    const guitarStack = guitarState.getGuitarStr();
    const guitarSlow = guitarState.guitar.settings.slow;
    const guitarGain = guitarState.guitar.settings.gain;

    // bass
    const bassState = useBassStore.getState();
    const bassStack = bassState.getBassStr();
    const bassSlow = bassState.bass.settings.slow;
    const bassGain = bassState.bass.settings.gain;

    // synth
    const synthState = useSynthStore.getState();
    const synthStack = synthState.getSynthStr();
    const synthSlow = synthState.synth.settings.slow;
    const synthGain = synthState.synth.settings.gain;

    // drums
    const drumState = useDrumStore.getState();
    const drumStack = drumState.getDrumStr();
    const drumBank = drumState.drum.settings.bank;
    const drumSlow = drumState.drum.settings.slow;
    const drumGain = drumState.drum.settings.gain;

    return `
    setcps(${BPM}/60/4)

    samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')
    
    function makeNote(n, s, g, r) {
        return note(n).sound(s).postgain(g).release(r);
    }
    stack(
        stack(
            ${drumStack}.bank("${drumBank}").slow(${drumSlow}).gain(${drumGain})
        ),

        stack(
            ${keyboardStack}.slow(${keyboardSlow}).gain(${keyboardGain})
        ),

        stack(
            ${guitarStack}.slow(${guitarSlow}).gain(${guitarGain})
        ),

        stack(
            ${bassStack}.slow(${bassSlow}).gain(${bassGain})
        ),

        stack(
            ${synthStack}.slow(${synthSlow}).gain(${synthGain})
        )
    ).log()
    `;
}
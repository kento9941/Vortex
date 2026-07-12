import { useEffect, useRef } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { drawPianoroll } from "@strudel/draw";
import { getAudioContext, webaudioOutput, registerSynthSounds, initAudioOnFirstClick } from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import { transpiler } from "@strudel/transpiler";
import { evalScope } from "@strudel/core";
// import { MyTunes } from "../../tunes/my-tunes";
// temporarily use this instead of MyTunes
import { stranger_tune } from "../../tunes/sample-tunes";
import { useStrudelStore } from "../../stores/useStrudelStore";

// @strudel/codemirror ships no official types, so this interface is
// hand-written from how the instance is actually used below, not from
// a real class definition.
interface StrudelMirrorInstance {
    evaluate: () => void;
    stop: () => void;
    setCode: (code: string) => void;
}

let globalEditor: StrudelMirrorInstance | null = null;

const handleD3Data = (event: Event): void => {
    const detail = (event as CustomEvent<string[]>).detail;
    console.log(detail);
};

export default function StrudelEditor() {
    const setControls = useStrudelStore((state) => state.setControls);
    const setPlaying = useStrudelStore((state) => state.setPlaying);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        document.addEventListener("d3Data", handleD3Data);
        hasRun.current = true;

        // Adapted from the official example:
        // https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl

        const canvas = document.getElementById("roll") as HTMLCanvasElement | null;
        const editorRoot = document.getElementById("editor");

        if (!canvas || !editorRoot) {
            console.error("Strudel editor: missing #roll or #editor element");
            return;
        }

        canvas.width = canvas.width * 2;
        canvas.height = canvas.height * 2;
        const drawContext = canvas.getContext("2d");

        if (!drawContext) {
            console.error("Strudel editor: could not get 2d context from #roll");
            return;
        }

        const drawTime: [number, number] = [-2, 2];

        globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: editorRoot,
            drawTime,
            onDraw: (haps: any, time: number) =>
                drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick();
                    const loadModules = evalScope(
                        import("@strudel/core"),
                        import("@strudel/draw"),
                        import("@strudel/mini"),
                        import("@strudel/tonal"),
                        import("@strudel/webaudio")
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
        });

        const procTextarea = document.getElementById("proc") as HTMLTextAreaElement | null;
        if (procTextarea) {
            procTextarea.value = stranger_tune;
        }
    }, []);

    const handlePlay = (): void => {
        globalEditor?.evaluate();
        setPlaying(true);
    };

    const handleStop = (): void => {
        globalEditor?.stop();
        setPlaying(false);
    };

    const handleProc = (): void => {
        globalEditor?.setCode(stranger_tune);
    };

    useEffect(() => {
        setControls({
            play: handlePlay,
            stop: handleStop,
            proc: handleProc,
        });
    }, [setControls]);

    return (
        <div>
            <textarea id="proc" rows={10} style={{ width: "100%" }} hidden />
            <canvas id="roll" style={{ border: "1px solid #ccc" }} hidden />
            <div
                id="editor"
                style={{ textAlign: "left", margin: "0 auto", width: "85vw" }}
                hidden
            />
        </div>
    );
}
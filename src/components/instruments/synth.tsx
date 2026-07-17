import { useState } from "react";
import type { MelodicTrackName } from "../../stores/types";
import { useSynthStore } from "../../stores/useSynthStore";
import MelodicBars from "./melodic-instrument/melodic-bars";
import MelodicTracks from "./melodic-instrument/melodic-tracks";
import InstrumentSettings from "./melodic-instrument/instrument-settings";
import NoteSettings from "./melodic-instrument/note-settings";
import PianoRoll from "./ui/piano-roll";

const BANKS = [
    { value: "saw", label: "SAW" },
    { value: "square", label: "SQUARE" },
    { value: "triangle", label: "TRIANGLE" },
];

export default function Synth() {
    const [selectedNote, setSelectedNote] = useState<{ note: MelodicTrackName, index: number } | null>(null);
    const synth = useSynthStore((s) => s.synth);
    const settings = useSynthStore((s) => s.synth.settings);
    const updateSynth = useSynthStore((s) => s.updateSynth);
    const updateNote = useSynthStore((s) => s.updateNote);

    return (
        <div className="flex flex-col gap-[0.2rem]">
            <div className="flex justify-between">
                <InstrumentSettings
                    banks={BANKS}
                    settings={settings}
                    updateInstrument={updateSynth}
                />
                <div className="min-w-[40.7rem]" />
                {selectedNote && (
                    <NoteSettings
                        selectedNote={selectedNote}
                        noteData={synth[selectedNote.note].struct[selectedNote.index]}
                        updateNote={updateNote}
                    />
                )}
            </div>

            <div className="flex gap-[0.2rem]">
                <MelodicTracks
                    instrument={synth}
                    updateInstrument={updateSynth}
                />
                <PianoRoll />
                <MelodicBars
                    instrument={synth}
                    updateInstrument={updateSynth}
                    updateNote={updateNote}
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
                />
            </div>
        </div>
    );
}

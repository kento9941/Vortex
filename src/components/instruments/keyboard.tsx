import { useState } from "react";
import type { MelodicTrackName } from "../../stores/types";
import { useKeyboardStore } from "../../stores/useKeyboardStore";
import MelodicBars from "./melodic-instrument/melodic-bars";
import MelodicTracks from "./melodic-instrument/melodic-tracks";
import InstrumentSettings from "./melodic-instrument/instrument-settings";
import NoteSettings from "./melodic-instrument/note-settings";
import PianoRoll from "./ui/piano-roll";

const BANKS = [
    { value: "gm_piano", label: "ACOUSTIC PIANO" },
    { value: "gm_epiano1", label: "KEYBOARD 1" },
    { value: "gm_epiano2", label: "KEYBOARD 2" },
];

export default function Keyboard() {
    const [selectedNote, setSelectedNote] = useState<{ note: MelodicTrackName, index: number } | null>(null);
    const keyboard = useKeyboardStore((s) => s.keyboard);
    const settings = useKeyboardStore((s) => s.keyboard.settings);
    const updateKeyboard = useKeyboardStore((s) => s.updateKeyboard);
    const updateNote = useKeyboardStore((s) => s.updateNote);

    return (
        <div className="flex flex-col gap-[0.2rem] px-[0.2rem]">
            <div className="flex justify-between">
                <InstrumentSettings
                    banks={BANKS}
                    settings={settings}
                    updateInstrument={updateKeyboard}
                />
                {selectedNote && (
                    <NoteSettings
                        selectedNote={selectedNote}
                        noteData={keyboard[selectedNote.note].struct[selectedNote.index]}
                        updateNote={updateNote}
                    />
                )}
            </div>

            <div className="flex gap-[0.2rem]">
                <MelodicTracks
                    instrument={keyboard}
                    updateInstrument={updateKeyboard}
                />
                <PianoRoll />
                <MelodicBars
                    instrument={keyboard}
                    updateInstrument={updateKeyboard}
                    updateNote={updateNote}
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
                />
            </div>
        </div>
    );
}

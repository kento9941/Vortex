import { useState } from "react";
import type { MelodicTrackName } from "../../stores/types";
import { useBassStore } from "../../stores/useBassStore";
import MelodicBars from "./melodic-instrument/melodic-bars";
import MelodicTracks from "./melodic-instrument/melodic-tracks";
import InstrumentSettings from "./melodic-instrument/instrument-settings";
import NoteSettings from "./melodic-instrument/note-settings";
import PianoRoll from "./ui/piano-roll";

const BANKS = [
    { value: "gm_acoustic_bass", label: "ACOUSTIC BASS" },
    { value: "gm_bassoon", label: "BASSOON" },
    { value: "gm_electric_bass_pick", label: "PICK E-BASS" },
    { value: "gm_fretless_bass", label: "FRETLESS BASS" },
    { value: "gm_lead_8_bass_lead", label: "BASS LEAD" },
    { value: "gm_slap_bass_1", label: "SLAP BASS" },
    { value: "gm_synth_bass_1", label: "SYNTH BASS" },
];

export default function Bass() {
    const [selectedNote, setSelectedNote] = useState<{ note: MelodicTrackName, index: number } | null>(null);
    const bass = useBassStore((s) => s.bass);
    const settings = useBassStore((s) => s.bass.settings);
    const updateBass = useBassStore((s) => s.updateBass);
    const updateNote = useBassStore((s) => s.updateNote);

    return (
        <div className="flex flex-col gap-[0.2rem]">
            <div className="flex justify-between">
                <InstrumentSettings
                    banks={BANKS}
                    settings={settings}
                    updateInstrument={updateBass}
                />
                <div className="min-w-[40.7rem]" />
                {selectedNote && (
                    <NoteSettings
                        selectedNote={selectedNote}
                        noteData={bass[selectedNote.note].struct[selectedNote.index]}
                        updateNote={updateNote}
                    />
                )}
            </div>

            <div className="flex gap-[0.2rem]">
                <MelodicTracks
                    instrument={bass}
                    updateInstrument={updateBass}
                />
                <PianoRoll />
                <MelodicBars
                    instrument={bass}
                    updateInstrument={updateBass}
                    updateNote={updateNote}
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
                />
            </div>
        </div>
    );
}

import { useState } from "react";
import type { MelodicTrackName } from "../../stores/types";
import { useGuitarStore } from "../../stores/useGuitarStore";
import MelodicBars from "./melodic-instrument/melodic-bars";
import MelodicTracks from "./melodic-instrument/melodic-tracks";
import InstrumentSettings from "./melodic-instrument/instrument-settings";
import NoteSettings from "./melodic-instrument/note-settings";
import PianoRoll from "./ui/piano-roll";

const BANKS = [
    { value: "gm_acoustic_guitar_nylon", label: "ACOUSTIC NYLON" },
    { value: "gm_acoustic_guitar_steel", label: "ACOUSTIC STEEL" },
    { value: "gm_distortion_guitar", label: "DISTORTION" },
    { value: "gm_electric_guitar_clean", label: "CLEAN ELECTRIC" },
    { value: "gm_electric_guitar_jazz", label: "JAZZ ELECTRIC" },
    { value: "gm_electric_guitar_muted", label: "MUTED ELECTRIC" },
    { value: "gm_overdriven_guitar", label: "OVERDRIVEN" },
];

export default function Guitar() {
    const [selectedNote, setSelectedNote] = useState<{ note: MelodicTrackName, index: number } | null>(null);
    const guitar = useGuitarStore((s) => s.guitar);
    const settings = useGuitarStore((s) => s.guitar.settings);
    const updateGuitar = useGuitarStore((s) => s.updateGuitar);
    const updateNote = useGuitarStore((s) => s.updateNote);

    return (
        <div className="flex flex-col gap-[0.2rem]">
            <div className="flex gap-[0.2rem]">
                <InstrumentSettings
                    banks={BANKS}
                    settings={settings}
                    updateInstrument={updateGuitar}
                />
                {selectedNote && (
                    <NoteSettings
                        selectedNote={selectedNote}
                        noteData={guitar[selectedNote.note].struct[selectedNote.index]}
                        updateNote={updateNote}
                    />
                )}
            </div>

            <div className="flex gap-[0.2rem]">
                <div className="mt-[1rem]">
                    <MelodicTracks
                        instrument={guitar}
                        updateInstrument={updateGuitar}
                    />
                </div>
                <div className="mt-[1rem]">
                    <PianoRoll />
                </div>
                <MelodicBars
                    instrument={guitar}
                    updateInstrument={updateGuitar}
                    updateNote={updateNote}
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
                />
            </div>
        </div>
    );
}

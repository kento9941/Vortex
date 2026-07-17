import type { MelodicTrackName, MelodicNoteData } from "../../../stores/types";
import type { SelectedNoteProps } from "../melodic-instrument/melodic-bars";

interface OctaveRadioProps {
    selectedNote: SelectedNoteProps;
    note: string;
    updateNote: (track: MelodicTrackName, index: number, updates: Partial<MelodicNoteData>) => void;
}

const OctaveRadio = ({ selectedNote, note, updateNote }: OctaveRadioProps) => {
    // e.g. cs -> c#
    const displayBase = selectedNote.note.replace("s", "#");
    const displayNote = displayBase.charAt(0).toUpperCase() + displayBase.slice(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNoteValue = e.target.value;
        updateNote(selectedNote.note, selectedNote.index, { note: newNoteValue });
    };

    return (
        <div className="radio-container">
            {[1, 2, 3, 4, 5, 6].map((octave) => {
                const value = `${selectedNote.note}${octave}`;
                return (
                    <div className="radio-wrapper" key={octave}>
                        <label className="radio-button">
                            <span className="radio-label">{`${displayNote}${octave}`}</span>
                            <input
                                type="radio"
                                name={`radio-group-${selectedNote.index}`}
                                value={value}
                                checked={note === value}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handleChange(e);
                                }}
                            />
                            <span className="radio-checkmark"></span>
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

export default OctaveRadio;

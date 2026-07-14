import type { MelodicTrackName, MelodicNoteData } from "../../../stores/types";
import type { SelectedNoteProps } from "../melodic-instrument/melodic-bars";

const STEP = 0.25;
const MIN = 0.25;
const MAX = 4;

interface ReleaseSelectorProps {
    selectedNote: SelectedNoteProps;
    release: number;
    updateNote: (track: MelodicTrackName, index: number, updates: Partial<MelodicNoteData>) => void;
}

export default function ReleaseSelector({ selectedNote, release, updateNote }: ReleaseSelectorProps) {
    const handleChange = (value: number | string) => {
        let num = typeof value === "number" ? value : parseFloat(value);
        if (isNaN(num)) return;
        num = Math.max(MIN, Math.min(MAX, num));
        updateNote(selectedNote.note, selectedNote.index, { release: num });
    };

    return (
        <div className="value-selector">
            <button
                type="button"
                className="value-button"
                onClick={() => handleChange(release - STEP)}
            >
                <svg className="w-full h-full" viewBox="0 0 13 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5H12.1667" stroke="#C0C0C0"/>
                </svg>
            </button>
            <input
                className="value-input"
                type="number"
                step={STEP}
                min={MIN}
                max={MAX}
                value={release}
                onChange={(e) => handleChange(e.target.value)}
            />
            <button
                type="button"
                className="value-button"
                onClick={() => handleChange(release + STEP)}
            >
                <svg className="w-full h-full" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.33333 0.5V12.1667M0.5 6.33333H12.1667" stroke="#C0C0C0" />
                </svg>
            </button>
        </div>
    );
}
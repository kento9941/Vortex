import type { MelodicTrackName, MelodicInstrumentData, MelodicNoteData } from "../../../stores/types";
import { addBar } from "../../../utils/bar-handlers/add-bar";
import { deleteBar } from "../../../utils/bar-handlers/delete-bar";
import AddDeleteButton from "../ui/add-delete-button";

const TRACK_ORDER: MelodicTrackName[] = ["b", "as", "a", "gs", "g", "fs", "f", "e", "ds", "d", "cs", "c"];

export type SelectedNoteProps = {
    note: MelodicTrackName;
    index: number;
};

interface MelodicBarsProps {
    instrument: MelodicInstrumentData;
    updateInstrument: <K extends keyof MelodicInstrumentData>(name: K, updates: Partial<MelodicInstrumentData[K]>) => void;
    updateNote: (track: MelodicTrackName, index: number, updates: Partial<MelodicNoteData>) => void;
    selectedNote: SelectedNoteProps | null;
    setSelectedNote: (selectedNote: SelectedNoteProps | null) => void;
}

export default function MelodicBars({
    instrument,
    updateInstrument,
    updateNote,
    selectedNote,
    setSelectedNote,
}: MelodicBarsProps) {
    // read the length from the first track in the order, falling back to 0
    const totalSteps = instrument[TRACK_ORDER[0]]?.struct?.length || 0;

    // calculates exactly how many beat dividers fit in the current sequence length
    const totalDividers = Math.floor((totalSteps - 1) / 4);

    // bar handler
    const handleAdd = () => addBar({ instrument: instrument, update: updateInstrument });
    const handleDelete = () => deleteBar({ instrument: instrument, update: updateInstrument });

    return (
        <div className="flex w-full overflow-x-auto">
            <div className="flex flex-col gap-[0.2rem] relative w-max">
                {TRACK_ORDER.map((trackKey) => (
                    <TrackRow
                        key={trackKey}
                        trackName={trackKey}
                        track={instrument[trackKey]}
                        updateNote={updateNote}
                        selectedNote={selectedNote}
                        setSelectedNote={setSelectedNote}
                    />
                ))}

                {Array.from({ length: Math.max(0, totalDividers) }).map((_, i) => {
                    const noteBlockCount = (i + 1) * 4;
                    const leftOffset = noteBlockCount * 1.5 - 0.1;

                    return (
                        <div
                            key={i}
                            className="absolute top-0 bottom-0 pointer-events-none z-10"
                            style={{
                                left: `${leftOffset}rem`,
                                width: "1px",
                                backgroundColor: "rgba(255, 255, 255, 0.18)",
                                transform: "translateX(-50%)",
                            }}
                        />
                    );
                })}
            </div>

            {/* add/delete bar button */}
            <div className="ml-[1rem] mr-[5rem]">
                <AddDeleteButton onAdd={handleAdd} onDelete={handleDelete} />
            </div>
        </div>
    );
}

const TrackRow = ({
    trackName,
    track,
    updateNote,
    selectedNote,
    setSelectedNote,
}: {
    trackName: MelodicTrackName;
    track: MelodicInstrumentData[MelodicTrackName];
    updateNote: (track: MelodicTrackName, index: number, updates: Partial<MelodicNoteData>) => void;
    selectedNote: SelectedNoteProps | null;
    setSelectedNote: (val: SelectedNoteProps | null) => void;
}) => {
    const handleCellClick = (index: number, currentNote: string) => {
        const isAlreadySelected = selectedNote?.note === trackName && selectedNote?.index === index;

        if (currentNote === "~") {
            updateNote(trackName, index, { note: `${trackName}3`, gain: 1, release: 1 });
            setSelectedNote({ note: trackName, index });
        } else if (isAlreadySelected) {
            updateNote(trackName, index, { note: "~" });
            setSelectedNote(null);
        } else {
            setSelectedNote({ note: trackName, index });
        }
    };

    // Failsafe in case track data isn't loaded yet
    if (!track || !track.struct) return null;

    return (
        <div className="h-[2.6rem] flex gap-[0.2rem]">
            {track.struct.map((noteData, j) => {
                const isSelected = selectedNote?.note === trackName && selectedNote?.index === j;
                const isActive = noteData.note !== "~";

                return (
                    <div
                        key={j}
                        className="h-full w-[1.3rem] flex items-end p-[0.1rem] cursor-pointer"
                        onClick={() => handleCellClick(j, noteData.note)}
                        style={{
                            backgroundColor: isActive ? (isSelected ? "#F5F5F5" : "#C0C0C0") : "#252525",
                            boxShadow: isSelected ? "inset 0 0 0 0.08rem #F5F5F5, inset 0 0 0 0.16rem #252525" : "none",
                            transition: "background-color 0.10s, outline 0.10s",
                            flexShrink: 0,
                        }}
                    />
                );
            })}
        </div>
    );
};
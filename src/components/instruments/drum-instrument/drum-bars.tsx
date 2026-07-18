import type { DrumState, DrumTrackName } from "../../../stores/useDrumStore";
import { addDrumBar } from "../../../utils/bar-handlers/add-bar";
import { deleteBar } from "../../../utils/bar-handlers/delete-bar";
import AddDeleteButton from "../ui/add-delete-button";

const TRACK_ORDER: DrumTrackName[] = [
    "hihat",
    "open_hihat",
    "snare_drum",
    "rim_shot",
    "low_tom",
    "middle_tom",
    "high_tom",
    "ride_cymbal",
    "crash_cymbal",
    "bass_drum",
];

const DRUM_HIT_SYMBOL: Record<DrumTrackName, string> = {
    hihat: "hh",
    open_hihat: "oh",
    snare_drum: "sd",
    rim_shot: "rim",
    low_tom: "lt",
    middle_tom: "mt",
    high_tom: "ht",
    ride_cymbal: "rd",
    crash_cymbal: "cr",
    bass_drum: "bd",
};

interface DrumBarsProps {
    drum: DrumState;
    updateDrum: <K extends keyof DrumState>(name: K, updates: Partial<DrumState[K]>) => void;
}

export default function DrumBars({ drum, updateDrum }: DrumBarsProps) {
    const totalSteps = drum[TRACK_ORDER[0]]?.struct?.length || 0;
    const totalDividers = Math.floor((totalSteps - 1) / 4);

    const handleAdd = () => addDrumBar({ instrument: drum, update: updateDrum });
    const handleDelete = () => deleteBar({ instrument: drum, update: updateDrum });

    return (
        <div className="flex w-full overflow-x-auto pt-[1rem]">
            <div className="flex flex-col gap-[0.2rem] relative w-max">
                {TRACK_ORDER.map((trackKey) => (
                    <DrumTrackRow
                        key={trackKey}
                        trackName={trackKey}
                        track={drum[trackKey]}
                        updateDrum={updateDrum}
                    />
                ))}

                {Array.from({ length: Math.max(0, totalDividers) }).map((_, i) => {
                    const noteBlockCount = (i + 1) * 4;
                    const leftOffset = noteBlockCount * 1.5 - 0.1;
                    const startOfBar = (i + 1) % 4 ? false : true;
                    const showLabel = i % 4 ? false : true;
                    const label = i / 4 + 1;

                    return (
                        <div
                            key={i}
                            className="absolute bottom-0 pointer-events-none z-10"
                            style={{
                                top: startOfBar ? "-1rem" : 0,
                                left: `${leftOffset}rem`,
                                width: "1px",
                                backgroundColor: "rgba(255, 255, 255, 0.18)",
                                transform: "translateX(-50%)",
                            }}
                        >
                            {showLabel &&
                                <div className="relative">
                                    <span className="absolute -top-[1rem] -left-[5.7rem]">{label}</span>
                                </div>
                            }
                        </div>
                    );
                })}
            </div>

            <div className="ml-[1rem] mr-[5rem]">
                <AddDeleteButton onAdd={handleAdd} onDelete={handleDelete} />
            </div>
        </div>
    );
}

const DrumTrackRow = ({
    trackName,
    track,
    updateDrum,
}: {
    trackName: DrumTrackName;
    track: DrumState[DrumTrackName];
    updateDrum: <K extends keyof DrumState>(name: K, updates: Partial<DrumState[K]>) => void;
}) => {
    if (!track || !track.struct) return null;

    const handleCellClick = (index: number, currentStep: string) => {
        const newStruct = [...track.struct];
        newStruct[index] = currentStep === "~" ? DRUM_HIT_SYMBOL[trackName] : "~";
        updateDrum(trackName, { struct: newStruct });
    };

    return (
        <div className="h-[2.6rem] flex gap-[0.2rem]">
            {track.struct.map((step, j) => {
                const isActive = step !== "~";
                return (
                    <div
                        key={j}
                        className="h-full w-[1.3rem] flex items-end p-[0.1rem] cursor-pointer"
                        onClick={() => handleCellClick(j, step)}
                        style={{
                            backgroundColor: isActive ? "#C0C0C0" : "#252525",
                            transition: "background-color 0.10s",
                            flexShrink: 0,
                        }}
                    />
                );
            })}
        </div>
    );
};
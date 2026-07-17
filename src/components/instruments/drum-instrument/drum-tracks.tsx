import type { DrumState, DrumTrackName } from "../../../stores/useDrumStore";
import VolumeSlider from "../ui/volume-slider";
import Speaker from "../ui/speaker";

const TRACK_ORDER: DrumTrackName[] = [
    "hihat", "open_hihat", "snare_drum", "rim_shot",
    "low_tom", "middle_tom", "high_tom",
    "ride_cymbal", "crash_cymbal", "bass_drum",
];

const TRACK_LABELS: Record<DrumTrackName, string> = {
    hihat: "HI-HAT",
    open_hihat: "OPEN HI-HAT",
    snare_drum: "SNARE DRUM",
    rim_shot: "RIM SHOT",
    low_tom: "LOW TOM",
    middle_tom: "MIDDLE TOM",
    high_tom: "HIGH TOM",
    ride_cymbal: "RIDE CYMBAL",
    crash_cymbal: "CRASH CYMBAL",
    bass_drum: "BASS DRUM",
};

interface DrumTracksProps {
    drum: DrumState;
    updateDrum: <K extends keyof DrumState>(name: K, updates: Partial<DrumState[K]>) => void;
}

export default function DrumTracks({ drum, updateDrum }: DrumTracksProps) {
    return (
        <div className="flex flex-col gap-[0.2rem]">
            {TRACK_ORDER.map((trackKey) => (
                <TrackVolumeRow
                    key={trackKey}
                    trackName={trackKey}
                    track={drum[trackKey]}
                    updateDrum={updateDrum}
                />
            ))}
        </div>
    );
}

const TrackVolumeRow = ({
    trackName,
    track,
    updateDrum,
}: {
    trackName: DrumTrackName;
    track: DrumState[DrumTrackName];
    updateDrum: <K extends keyof DrumState>(name: K, updates: Partial<DrumState[K]>) => void;
}) => {
    if (!track) return null;

    return (
        <div className="w-[17rem] h-[2.6rem] bg-[#252525] flex items-center justify-between px-[1rem]">
            <span className="small-text shrink-0">{TRACK_LABELS[trackName]}</span>
            <div className="flex items-center gap-[0.2rem]">
                <Speaker
                    play={track.play}
                    onToggle={() => updateDrum(trackName, { play: !track.play })}
                />
                <VolumeSlider
                    gain={track.gain}
                    onChange={(gain) => updateDrum(trackName, { gain })}
                />
            </div>
        </div>
    );
};
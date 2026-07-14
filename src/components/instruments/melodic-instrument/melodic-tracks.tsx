import type { MelodicTrackName, MelodicInstrumentData } from "../../../stores/types";
import VolumeSlider from "../ui/volume-slider";
import Speaker from "../ui/speaker";

const TRACK_ORDER: MelodicTrackName[] = ["b", "as", "a", "gs", "g", "fs", "f", "e", "ds", "d", "cs", "c"];

const TRACK_LABELS: Record<MelodicTrackName, string> = {
    b: "B",
    as: "A#",
    a: "A",
    gs: "G#",
    g: "G",
    fs: "F#",
    f: "F",
    e: "E",
    ds: "D#",
    d: "D",
    cs: "C#",
    c: "C",
};

interface MelodicTracksProps {
    instrument: MelodicInstrumentData;
    updateInstrument: <K extends keyof MelodicInstrumentData>(name: K, updates: Partial<MelodicInstrumentData[K]>) => void;
}

export default function MelodicTracks({ instrument, updateInstrument }: MelodicTracksProps) {
    return (
        <div className="flex flex-col gap-[0.2rem]">
            {TRACK_ORDER.map((trackKey) => (
                <TrackVolumeRow
                    key={trackKey}
                    trackName={trackKey}
                    track={instrument[trackKey]}
                    updateInstrument={updateInstrument}
                />
            ))}
        </div>
    );
}

const TrackVolumeRow = ({
    trackName,
    track,
    updateInstrument,
}: {
    trackName: MelodicTrackName;
    track: MelodicInstrumentData[MelodicTrackName];
    updateInstrument: <K extends keyof MelodicInstrumentData>(name: K, updates: Partial<MelodicInstrumentData[K]>) => void;
}) => {
    if (!track) return null;

    return (
        <div className="w-[12rem] h-[2.6rem] bg-[#252525] flex items-center justify-between px-[1.5rem]">
            <span className="w-[2rem] shrink-0">{TRACK_LABELS[trackName]}</span>
            <div className="flex items-center gap-[0.2rem]">
                <Speaker
                    play={track.play}
                    onToggle={() => updateInstrument(trackName, { play: !track.play })}
                />
                <VolumeSlider
                    gain={track.gain}
                    onChange={(gain) => updateInstrument(trackName, { gain })}
                />
            </div>
        </div>
    );
};
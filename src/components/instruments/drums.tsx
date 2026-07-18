import { useDrumStore } from "../../stores/useDrumStore";
import DrumBars from "./drum-instrument/drum-bars";
import DrumTracks from "./drum-instrument/drum-tracks";
import DrumSettings from "./drum-instrument/drum-settings";

const BANKS = [
    { value: "AkaiMPC60", label: "AKAI MPC-60" },
    { value: "AlesisSR16", label: "ALESIS SR-16" },
    { value: "EmuSP12", label: "EMU SP-12" },
    { value: "LinnDrum", label: "LINN DRUM" },
    { value: "LinnLM1", label: "LINN LM-1" },
    { value: "OberheimDMX", label: "OBERHEIM DMX" },
    { value: "RolandTR606", label: "ROLAND TR-606" },
    { value: "RolandTR707", label: "ROLAND TR-707" },
    { value: "RolandTR808", label: "ROLAND TR-808" },
    { value: "RolandTR909", label: "ROLAND TR-909" },
];

export default function Drums() {
    const drum = useDrumStore((s) => s.drum);
    const updateDrum = useDrumStore((s) => s.updateDrum);

    return (
        <div className="flex flex-col gap-[0.2rem]">
            <div className="flex gap-[0.2rem]">
                <DrumSettings banks={BANKS} settings={drum.settings} updateDrum={updateDrum} />
            </div>

            <div className="flex gap-[0.2rem]">
                <div className="mt-[1rem]">
                    <DrumTracks drum={drum} updateDrum={updateDrum} />
                </div>
                <DrumBars drum={drum} updateDrum={updateDrum} />
            </div>
        </div>
    );
}
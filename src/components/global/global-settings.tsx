import type { Instrument } from "../../App";
import BPMSelector from "./bpm-selector";
import InstrumentSelector from "./instrument-selector";
import PlayButton from "./play-button";

interface GlobalSettingsProps {
    selectedInstrument: Instrument;
    setSelectedInstrument: React.Dispatch<React.SetStateAction<Instrument>>;
}

const GlobalSettings = ({ selectedInstrument, setSelectedInstrument }: GlobalSettingsProps) => {
    return (
        <div className="w-[38.9rem] h-[5.5rem] flex flex-col justify-center gap-[0.2rem] px-[1rem]">
            <div className="grey-text mb-[0.5rem]">GLOBAL SETTINGS</div>
            <div className="small-text flex">
                <span className="w-[7.5rem]">BPM</span>
                <span className="w-[5.5rem]">PLAY/STOP</span>
                <span>INSTRUMENTS</span>
            </div>
            <div className="flex items-center">
                <div className="flex justify-start w-[8.8rem]">
                    <BPMSelector />
                </div>
                <div className="w-[4.2rem]">
                    <PlayButton />
                </div>
                <div className="flex justify-start">
                    <InstrumentSelector selectedInstrument={selectedInstrument} setSelectedInstrument={setSelectedInstrument} />
                </div>
            </div>
        </div>
    )
}

export default GlobalSettings;
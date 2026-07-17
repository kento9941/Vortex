import type { Instrument } from "../../App";

interface InstrumentSelectorProps {
    selectedInstrument: Instrument;
    setSelectedInstrument: React.Dispatch<React.SetStateAction<Instrument>>;
}

const InstrumentSelector = ({ selectedInstrument, setSelectedInstrument }: InstrumentSelectorProps) => {
    return (
        <div className="flex items-center gap-[0.3rem]">
            <button
                type="button"
                className="w-[4.5rem] p-[0.2rem]"
                onClick={() => setSelectedInstrument("KEYBOARD")}
                style={{ backgroundColor: selectedInstrument === "KEYBOARD" ? "#525252" : "transparent" }}
            >
                KEYBOARD
            </button>
            <button
                type="button"
                className="w-[4.5rem] p-[0.2rem]"
                onClick={() => setSelectedInstrument("GUITAR")}
                style={{ backgroundColor: selectedInstrument === "GUITAR" ? "#525252" : "transparent" }}
            >
                GUITAR
            </button>
            <button
                type="button"
                className="w-[4.5rem] p-[0.2rem]"
                onClick={() => setSelectedInstrument("BASS")}
                style={{ backgroundColor: selectedInstrument === "BASS" ? "#525252" : "transparent" }}
            >
                BASS
            </button>
            <button
                type="button"
                className="w-[4.5rem] p-[0.2rem]"
                onClick={() => setSelectedInstrument("SYNTH")}
                style={{ backgroundColor: selectedInstrument === "SYNTH" ? "#525252" : "transparent" }}
            >
                SYNTH
            </button>
            <button
                type="button"
                className="w-[4.5rem] p-[0.2rem]"
                onClick={() => setSelectedInstrument("DRUMS")}
                style={{ backgroundColor: selectedInstrument === "DRUMS" ? "#525252" : "transparent" }}
            >
                DRUMS
            </button>
        </div>
    )
}

export default InstrumentSelector;
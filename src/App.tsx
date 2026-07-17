import "./App.css"
// import AudioVisualizer from "./components/audio-visualizer/audio-visualizer"
import StrudelEditor from "./components/strudel/strudel-editor"
import Keyboard from "./components/instruments/keyboard"
import { useState, useEffect } from "react"
import Guitar from "./components/instruments/guitar"
import Bass from "./components/instruments/bass"
import Synth from "./components/instruments/synth"
import InstrumentSelector from "./components/global/instrument-selector"
import PlayButton from "./components/global/play-button"
import BPMSelector from "./components/global/bpm-selector"
import Drums from "./components/instruments/drums"
import DisabledNoteSettings from "./components/instruments/ui/disabled-note-settings"

export type Instrument = "KEYBOARD" | "GUITAR" | "BASS" | "SYNTH" | "DRUMS";

function App() {
  // ----------------------------------------
  // allow only wide enough screen width
  const [isTooSmall, setIsTooSmall] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>("KEYBOARD");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsTooSmall(window.innerWidth < 1366);
    };

    // run once on load
    checkScreenSize();

    // listen for real-time window resizing
    window.addEventListener('resize', checkScreenSize);
    
    // clean up listener when component unmounts
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isTooSmall) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#252525]">
        <h2>This platform is optimized for desktop displays.</h2>
      </div>
    );
  }

  return (
    <main className="w-full">
      {/* hero section */}
      <div className="w-full h-[10rem]"></div>

      <div className="relative px-[0.3rem] pb-[1rem]">
        {/* disabled note settings */}
        <div className="absolute top-0 left-[17.5rem] z-10">
          <DisabledNoteSettings />
        </div>

        {/* global settings */}
        <div className="absolute top-0 right-[0.3rem] w-[38.9rem] h-[5.5rem] flex flex-col justify-center gap-[0.2rem] px-[1rem] z-10">
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

        <div className="absolute top-0 left-0 w-full h-[5.5rem] bg-[#252525]" />

        {/* instruments */}
        { selectedInstrument === "KEYBOARD" && <Keyboard /> }
        { selectedInstrument === "GUITAR" && <Guitar /> }
        { selectedInstrument === "BASS" && <Bass /> }
        { selectedInstrument === "SYNTH" && <Synth /> }
        { selectedInstrument === "DRUMS" && <Drums /> }
      </div>
      
      <StrudelEditor />
      {/* <AudioVisualizer /> */}
    </main>
  )
}

export default App;

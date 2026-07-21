import "./App.css"
import AudioVisualizer from "./components/audio-visualizer/audio-visualizer"
import StrudelEditor from "./components/strudel/strudel-editor"
import Keyboard from "./components/instruments/keyboard"
import { useState, useEffect } from "react"
import Guitar from "./components/instruments/guitar"
import Bass from "./components/instruments/bass"
import Synth from "./components/instruments/synth"
import Drums from "./components/instruments/drums"
import DisabledNoteSettings from "./components/instruments/ui/disabled-note-settings"
import GlobalSettings from "./components/global/global-settings"
import NewFile from "./components/file-handlers/new-file"
import OpenFile from "./components/file-handlers/open-file"
import SaveFile from "./components/file-handlers/save-file"
import Logo from "./components/logo/logo"

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
      <div className="gradient-container w-full h-[10rem]">
        <div className="gradient-background" />

        <div className="relative z-10 w-full flex items-center justify-center pointer-events-none">
          <div className="w-[15rem] pl-[2rem]">
            <Logo />
          </div>

          <AudioVisualizer />

          <div className="w-[15rem] flex items-center justify-end gap-[2rem] pr-[2rem] z-10 pointer-events-auto">
            <NewFile />
            <OpenFile />
            <SaveFile />
          </div>
        </div>
      </div>

      {/* editor */}
      <div className="relative px-[0.3rem] pb-[1rem]">

        {/* settings background */}
        <div className="absolute top-0 left-0 w-full h-[5.5rem] bg-[#252525]" />

        {/* disabled note settings */}
        <div className="absolute top-0 left-[17.5rem] z-10">
          <DisabledNoteSettings />
        </div>

        {/* global settings */}
        <div className="absolute top-0 right-[0.3rem] z-10">
          <GlobalSettings selectedInstrument={selectedInstrument} setSelectedInstrument={setSelectedInstrument} />
        </div>

        {/* instruments */}
        { selectedInstrument === "KEYBOARD" && <Keyboard /> }
        { selectedInstrument === "GUITAR" && <Guitar /> }
        { selectedInstrument === "BASS" && <Bass /> }
        { selectedInstrument === "SYNTH" && <Synth /> }
        { selectedInstrument === "DRUMS" && <Drums /> }
      </div>
      
      {/* hidden */}
      <StrudelEditor />
    </main>
  )
}

export default App;

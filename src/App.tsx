import "./App.css"
import AudioVisualizer from "./components/audio-visualizer/audio-visualizer"
import StrudelControls from "./components/strudel/strudel-controls"
import StrudelEditor from "./components/strudel/strudel-editor"
import Keyboard from "./components/instruments/keyboard"

function App() {
  return (
    <main className="w-full">
      {/* hero section */}
      <div></div>

      <Keyboard />
      
      {/* editor */}
      <div className="w-full p-[0.5rem] flex gap-[0.2rem]"></div>
      <StrudelEditor />
      <StrudelControls />
      <AudioVisualizer />
    </main>
  )
}

export default App

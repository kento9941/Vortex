import './App.css'
import AudioVisualizer from './components/audio-visualizer/audio-visualizer'
import StrudelControls from './components/strudel/strudel-controls'
import StrudelEditor from './components/strudel/strudel-editor'

function App() {

  return (
    <main>
      <StrudelEditor />
      <StrudelControls />
      <AudioVisualizer />
    </main>
  )
}

export default App

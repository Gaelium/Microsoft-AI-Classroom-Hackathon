import logo from "./logo.svg";
import "./App.css";
import AudioRecorder from "./components/Audio.js";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AudioRecorder />
      </header>
    </div>
  );
}

export default App;

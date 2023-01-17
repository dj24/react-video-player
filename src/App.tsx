import "./App.css";
import { Video } from "./Video";

function App() {
  return (
    <div className="App">
      <h1>React Video Player</h1>
      <Video src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" />
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import StarMap from './components/InteractiveParticles/StarMap';
import Webcam from './components/Webcam/Webcam';
import InteractiveParticles from './components/InteractiveParticles/IntParts';
import Visualizer from './components/Visualizer/Visualizer';

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <InteractiveParticles />
        {/* <StarMap /> */}
        {/* <Webcam /> */}
        {/* <Visualizer /> */}
      </div>
    </div>
  );
}

export default App;

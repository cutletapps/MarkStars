import React from 'react';
import './App.css';
import StarMap from './components/StarMap/StarMap';
import Webcam from './components/Webcam/Webcam';

function App() {
  return (
    <div className="App">
      <div className="App-container">
        {/* <StarMap /> */}
        <Webcam />
      </div>
    </div>
  );
}

export default App;

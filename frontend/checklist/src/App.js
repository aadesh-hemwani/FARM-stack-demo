import React from 'react';
import './App.css';
import Home from "./Home.js";
import {Provider} from './Context'

function App() {
  return (
      <Provider>
        <div className="App">
          <Home/>
        </div>
      </Provider>
  );
}

export default App;

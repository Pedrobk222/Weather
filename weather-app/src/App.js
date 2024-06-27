// src/App.js

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Capitals from './pages/Capitals';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/capitals' element={<Capitals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import RegisterForm from './RegisterForm.js';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
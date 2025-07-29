import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductDetail from './DetailProduct/ProductDetail';
import HomePage from './components/HomePage.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
}

export default App;
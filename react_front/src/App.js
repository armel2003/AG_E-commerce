import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductDetail from './DetailProduct/ProductDetail';

function App() {
  return (
    <>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
}

export default App;


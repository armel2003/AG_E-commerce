import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LoginForm from "./components/LoginForm";
import ProductDetail from './DetailProduct/ProductDetail';
import HomePage from './components/HomePage.jsx';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/product/:id" element={<ProductDetail/>}/>
                <Route path="/login" element={<LoginForm/>}/>
            </Routes>
        </>
    );
}

export default App;

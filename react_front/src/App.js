import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LoginForm from "./page/LoginForm.jsx";
import ProductDetail from './components/ProductDetail.jsx';
import HomePage from './page/HomePage.jsx';
import RegisterForm from './page/RegisterForm.jsx';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/product/:id" element={<ProductDetail/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegisterForm/>}/>
            </Routes>
        </>
    );
}

export default App;
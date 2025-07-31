import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LoginForm from "./page/LoginForm.jsx";
import ProductDetail from './components/ProductDetail.jsx';
import HomePage from './page/HomePage.jsx';
import RegisterForm from './page/RegisterForm.jsx';
import Moncompte from './page/Moncompte.jsx';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage/>}/> 
                <Route path="/product/:id" element={<ProductDetail/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegisterForm/>}/>
                <Route path="/account/:id" element={<Moncompte/>}/>
            </Routes>
        </>
    );
}

export default App;
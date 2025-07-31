import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LoginForm from "./page/LoginForm.jsx";
import ProductDetail from './components/ProductDetail.jsx';
import HomePage from './page/HomePage.jsx';
import RegisterForm from './page/RegisterForm.jsx';
import Moncompte from './page/Moncompte.jsx';
import Boutique from './page/Boutique.jsx';
import Commande from './page/commande.jsx';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/product/:id" element={<ProductDetail/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegisterForm/>}/>
                <Route path="/account/:id" element={<Moncompte/>}/>
                <Route path="/boutique" element={<Boutique/>}/>
                <Route path="/commande" element={<Commande/>} />
            </Routes>
        </>
    );
}

export default App;
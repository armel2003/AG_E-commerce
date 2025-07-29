import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LoginForm from "./components/LoginForm";

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginForm/>}/>
            </Routes>
        </>
    );
}

export default App;

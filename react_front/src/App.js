import './App.css';
import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import ProductDetail from './components/ProductDetail.jsx';
import HomePage from './page/HomePage.jsx';
import LoginForm from './page/LoginForm.jsx';
import RegisterForm from './page/RegisterForm.jsx';
import Moncompte from './page/Moncompte.jsx';
import Boutique from './page/Boutique.jsx';
import Commande from './page/commande.jsx';
// admin
import AdminLayout from './pageAdmin/AdminLayout.jsx';
import AdminDashboard from './pageAdmin/AdminDashboard.jsx';
import CreateArticle from './pageAdmin/CreateArticle.jsx';
import EditArticle from './pageAdmin/EditArticle.jsx';
import UserManagement from './pageAdmin/UserManagement.jsx';
import EditCategory from './pageAdmin/EditCategorie.jsx';
import CreatCategory from './pageAdmin/CreatCategory.jsx';
import CartePrepayées from './page/Boutique2.jsx';
import Promo from './pageAdmin/promos.jsx';


function App() {
    return (
        <Routes>
            {/*  utilisateur */}
            <Route path="/" element={<HomePage/>}/>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/register" element={<RegisterForm/>}/>
            <Route path="/account/:id" element={<Moncompte/>}/>
            <Route path="/boutique" element={<Boutique/>}/>
            <Route path="/prepayes" element={<CartePrepayées/>}/>
            <Route path="/product/:id" element={<ProductDetail/>}/>
            <Route path="/commande" element={<Commande/>}/>

            {/* s admin */}
            <Route path="/admin" element={<AdminLayout/>}>
                <Route index element={<AdminDashboard/>}/>
                <Route path="dashboard" element={<AdminDashboard/>}/>
                <Route path="create-article" element={<CreateArticle/>}/>
                <Route path="create-category" element={<CreatCategory/>}/>
                <Route path=":id/edit" element={<EditArticle/>}/>
                <Route path=":id/category/edit" element={<EditCategory/>}/>
                <Route path="user-management" element={<UserManagement/>}/>
                <Route path="promo" element={<Promo/>}/>
            </Route>

            {/* Redirections */}
            <Route path="/admin/*" element={<Navigate to="/admin" replace/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );

}

export default App;
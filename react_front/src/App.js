import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
// import LoginForm from "./page/LoginForm.jsx";
// import ProductDetail from './components/ProductDetail.jsx';
import HomePage from './page/HomePage.jsx';
// import RegisterForm from './page/RegisterForm.jsx';
// import Moncompte from './page/Moncompte.jsx';
// import HomePage from './components/HomePage.jsx';

import AdminLayout from './pageAdmin/AdminLayout.jsx';
import AdminDashboard from './pageAdmin/AdminDashboard.jsx';
import CreateArticle from './pageAdmin/CreateArticle.jsx';
import EditArticle from './pageAdmin/EditArticle.jsx';
import UserManagement from './pageAdmin/UserManagement.jsx';
import EditCategory from './pageAdmin/EditCategorie.jsx';
import CreatCategory from './pageAdmin/CreatCategory.jsx';
//import ProductDetail from './DetailProduct/ProductDetail';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          {/* Routes enfants de AdminLayout */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create-article" element={<CreateArticle />} />
          <Route path="create-category" element={<CreatCategory />} />
          <Route path=":id/edit" element={<EditArticle />} />
          <Route path=":id/category/edit" element={<EditCategory />} />
          <Route path="user-management" element={<UserManagement />} />
        </Route>
        {/* <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/account/:id" element={<Moncompte/>}/> */}
        {/* Rediriger par défaut vers /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
        {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
      </Routes>
    </>
  );
}

export default App;

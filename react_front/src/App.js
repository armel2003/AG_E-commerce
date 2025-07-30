import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LoginForm from "./page/LoginForm.jsx";
import ProductDetail from './components/ProductDetail.jsx';
import HomePage from './page/HomePage.jsx';
import RegisterForm from './page/RegisterForm.jsx';
import Moncompte from './page/Moncompte.jsx';
import HomePage from './components/HomePage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import CreateArticle from './CreateArticle';
import EditArticle from './EditArticle';
import UserManagement from './UserManagement';
import ProductDetail from './DetailProduct/ProductDetail';


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
              <Route path=":id/edit" element={<EditArticle />} />
              <Route path="user-management" element={<UserManagement />} />
          </Route>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={<RegisterForm/>}/>
          <Route path="/account/:id" element={<Moncompte/>}/>
          {/* Rediriger par défaut vers /admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );

export default App;

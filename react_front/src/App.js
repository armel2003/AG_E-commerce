import React from 'react';
import HomePage from './components/HomePage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import CreateArticle from './CreateArticle';
import EditArticle from './EditArticle';
import UserManagement from './UserManagement';

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

          {/* Rediriger par défaut vers /admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}

export default App;

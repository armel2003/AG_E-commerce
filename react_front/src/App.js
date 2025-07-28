import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import CreateArticle from './CreateArticle';
import EditArticle from './EditArticle';
import UserManagement from './UserManagement';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="create-article" element={<CreateArticle />} />
            <Route path="edit-article/:id" element={<EditArticle />} />
            <Route path="user-management" element={<UserManagement />} />
          </Route>
          
          
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import pentakeysLogo from '../asset/pentakeys_logo.png';

function AdminLayout() {
  const navigate = useNavigate();

  // Simuler les données utilisateur admin
  const adminUser = {
    name: 'Admin',
    email: 'admin@pentakeys.com',
    role: 'Administrator'
  };

  const handleLogout = () => {
    // Rediriger vers la page de connexion
    navigate('/login');
    console.log('Déconnexion...');
  };

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="nav-container">
          <Link to="/admin" className="nav-brand">
            <img src={pentakeysLogo} alt="Pentakeys Logo" className="logo-img" />
          </Link>
          
          <ul className="nav-links">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="nav-link"
              >
                📊 Tableau de bord
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/create-article" 
                className="nav-link"
              >
                ➕ Créer un article
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/user-management" 
                className="nav-link"
              >
                👥 Gestion utilisateurs
              </Link>
            </li>
          </ul>

          <div className="nav-user">
            <div className="user-info">
              <span>👋 {adminUser.name}</span>
              <span className="badge badge-admin">{adminUser.role}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="fade-in">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

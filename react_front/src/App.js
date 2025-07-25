import React, { useState } from 'react';
import './App.css';
import AdminDashboard from './AdminDashboard';
import CreateArticle from './CreateArticle';
import EditArticle from './EditArticle';
import UserManagement from './UserManagement';
import pentakeysLogo from './pentakeys_logo.png'; // Assurez-vous que le logo est dans le bon chemin

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(true); // Simuler l'authentification admin
  const [editingArticleId, setEditingArticleId] = useState(null);

  // Simuler les données utilisateur admin
  const adminUser = {
    name: 'Admin',
    email: 'admin@pentakeys.com',
    role: 'Administrator'
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage('dashboard');
    setEditingArticleId(null);
    // Ici vous pourriez rediriger vers la page de connexion
    console.log('Déconnexion...');
  };

  const handleEditArticle = (articleId) => {
    setEditingArticleId(articleId);
    setCurrentPage('edit-article');
  };

  const handleCancelEdit = () => {
    setEditingArticleId(null);
    setCurrentPage('dashboard');
  };

  const handleUpdateArticle = (articleId, updatedData) => {
    console.log('Article mis à jour:', articleId, updatedData);
    // Ici vous pourriez mettre à jour les données dans un state global ou une base de données
  };

  if (!isAdmin) {
    return (
      <div className="App">
        <div className="admin-container">
          <div className="admin-card" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h2>Accès restreint</h2>
            <p>Cette zone est réservée aux administrateurs uniquement.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setIsAdmin(true)}
              style={{ marginTop: '1rem' }}
            >
              Se connecter comme Admin (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'create-article':
        return <CreateArticle />;
      case 'edit-article':
        return (
          <EditArticle 
            articleId={editingArticleId}
            onCancel={handleCancelEdit}
            onUpdate={handleUpdateArticle}
          />
        );
      case 'user-management':
        return <UserManagement />;
      default:
        return (
          <AdminDashboard 
            setCurrentPage={setCurrentPage}
            onEditArticle={handleEditArticle}
          />
        );
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="admin-nav">
        <div className="nav-container">
          <a href="#" className="nav-brand">
            <img src={pentakeysLogo} alt="Pentakeys Logo" className="logo-img" />
          </a>
          
          <ul className="nav-links">
            <li>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('dashboard');
                }}
              >
                📊 Tableau de bord
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'create-article' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('create-article');
                }}
              >
                ➕ Créer un article
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'user-management' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('user-management');
                }}
              >
                👥 Gestion utilisateurs
              </a>
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
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;

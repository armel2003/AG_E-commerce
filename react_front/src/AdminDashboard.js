import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ setCurrentPage, onEditArticle }) {
  const [articles, setArticles] = useState([
    { id: 1, name: 'Apex Legends - 1000 Coins', price: '€9.99', status: 'Actif', sales: 156 },
    { id: 2, name: 'Valorant - VP Bundle', price: '€24.99', status: 'Actif', sales: 89 },
    { id: 3, name: 'CS2 - Operation Pass', price: '€14.99', status: 'Épuisé', sales: 234 },
    { id: 4, name: 'LoL - RP Premium Pack', price: '€49.99', status: 'Actif', sales: 67 }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Données simulées pour le tableau de bord
  const stats = {
    totalUsers: 1247,
    totalArticles: articles.length,
    pendingOrders: 23,
    revenue: '€15,420'
  };

  const recentUsers = [
    { id: 1, name: 'Alexandre Martin', email: 'alex.martin@email.com', role: 'User', joinDate: '2025-01-20' },
    { id: 2, name: 'Sophie Dubois', email: 'sophie.d@email.com', role: 'User', joinDate: '2025-01-19' },
    { id: 3, name: 'Lucas Bernard', email: 'l.bernard@email.com', role: 'User', joinDate: '2025-01-18' },
    { id: 4, name: 'Emma Rousseau', email: 'emma.r@email.com', role: 'User', joinDate: '2025-01-17' }
  ];

  // Fonctions de gestion des articles
  const handleEditArticle = (articleId) => {
    if (onEditArticle) {
      onEditArticle(articleId);
    } else {
      // Fallback si onEditArticle n'est pas fourni
      console.log('Modifier l\'article:', articleId);
      setMessage({ type: 'success', text: `Redirection vers la modification de l'article ${articleId}...` });
      setTimeout(() => {
        setCurrentPage('create-article');
      }, 1500);
    }
  };

  const handleDeleteArticle = (articleId) => {
    const article = articles.find(a => a.id === articleId);
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const confirmDeleteArticle = () => {
    if (articleToDelete) {
      setArticles(prevArticles => prevArticles.filter(article => article.id !== articleToDelete.id));
      setMessage({ type: 'success', text: `Article "${articleToDelete.name}" supprimé avec succès ! 🗑️` });
      setShowDeleteModal(false);
      setArticleToDelete(null);
      
      // Masquer le message après 3 secondes
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  const cancelDeleteArticle = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  // Modal de confirmation de suppression
  const DeleteConfirmModal = () => {
    if (!showDeleteModal || !articleToDelete) return null;

    return (
      <div className="modal-overlay" onClick={cancelDeleteArticle}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="modal-title">
            🗑️ Confirmer la suppression
          </h3>
          <p className="modal-message">
            Êtes-vous sûr de vouloir supprimer l'article <strong>"{articleToDelete.name}"</strong> ?<br />
            Cette action est irréversible.
          </p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={cancelDeleteArticle}>
              Annuler
            </button>
            <button className="btn btn-delete" onClick={confirmDeleteArticle}>
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-container">
      {/* Modal de confirmation */}
      <DeleteConfirmModal />

      {/* En-tête de page */}
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">Vue d'ensemble de votre plateforme e-commerce gaming</p>
      </div>

      {/* Messages d'alerte */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Actions rapides */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--neon-purple)', marginBottom: '1rem' }}>🚀 Actions rapides</h3>
        <div className="btn-group">
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentPage('create-article')}
          >
            ➕ Créer un nouvel article
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentPage('user-management')}
          >
            👥 Gérer les utilisateurs
          </button>
          <button className="btn btn-secondary">
            📊 Voir les rapports
          </button>
          <button className="btn btn-secondary">
            ⚙️ Paramètres
          </button>
        </div>
      </div>

      {/* Articles récents */}
      <div className="grid grid-2">
        <div className="admin-card">
          <h3 style={{ color: 'var(--neon-purple)', marginBottom: '1rem' }}>🎮 Articles récents</h3>
          <div className="table-container">
            {articles.map(article => (
              <div key={article.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(124, 58, 237, 0.1)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {article.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {article.price} • {article.sales} ventes
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${article.status === 'Actif' ? 'badge-user' : 'badge-pending'}`}>
                    {article.status}
                  </span>
                  <div className="article-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditArticle(article.id)}
                      title="Modifier l'article"
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteArticle(article.id)}
                      title="Supprimer l'article"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="btn btn-secondary btn-small" 
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={() => setCurrentPage('create-article')}
          >
            Voir tous les articles
          </button>
        </div>

        {/* Utilisateurs récents */}
        <div className="admin-card">
          <h3 style={{ color: 'var(--neon-purple)', marginBottom: '1rem' }}>👥 Nouveaux utilisateurs</h3>
          <div className="table-container">
            {recentUsers.map(user => (
              <div key={user.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(124, 58, 237, 0.1)'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {user.email}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-user">{user.role}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="btn btn-secondary btn-small" 
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={() => setCurrentPage('user-management')}
          >
            Gérer les utilisateurs
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

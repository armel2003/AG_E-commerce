import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditArticle.css';

function EditArticle() {
  const { id: articleId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    game: '',
    digitalCode: '',
    image: '',
    stock: '',
    tags: '',
    featured: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'Monnaies virtuelles',
    'Pass de bataille',
    'Skins',
    'DLC',
    'Cartes cadeaux',
    'Abonnements'
  ];

  const games = [
    'Valorant',
    'League of Legends',
    'Apex Legends',
    'Counter-Strike 2',
    'Fortnite',
    'Rocket League',
    'Overwatch 2',
    'Call of Duty',
    'FIFA',
    'Minecraft'
  ];

  
  useEffect(() => {
    if (articleId) {
      const mockArticleData = {
        1: {
          name: 'Apex Legends - 1000 Coins',
          description: 'Pack de 1000 Apex Coins pour débloquer des légendes, skins et améliorations dans Apex Legends.',
          price: '9.99',
          category: 'Monnaies virtuelles',
          game: 'Apex Legends',
          digitalCode: 'APX-1000-COINS-2025',
          image: 'https://example.com/apex-coins.jpg',
          stock: '150',
          tags: 'apex, coins, battle-royale',
          featured: true
        },
        2: {
          name: 'Valorant - VP Bundle',
          description: 'Bundle premium de Valorant Points pour acheter agents, skins d\'armes et cosmétiques.',
          price: '24.99',
          category: 'Monnaies virtuelles',
          game: 'Valorant',
          digitalCode: 'VAL-VP-BUNDLE-2025',
          image: 'https://example.com/valorant-vp.jpg',
          stock: '89',
          tags: 'valorant, vp, tactical, fps',
          featured: false
        }
        
      };

      const articleData = mockArticleData[articleId];
      if (articleData) {
        setFormData(articleData);
      }
    }
  }, [articleId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    
    if (!formData.name || !formData.price || !formData.category || !formData.game) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires.' });
      setIsLoading(false);
      return;
    }

    try {
      // Simulation d'appel API pour la mise à jour
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Données article mises à jour:', formData);
      
      setMessage({ type: 'success', text: 'Article mis à jour avec succès ! ✅' });
      
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour de l\'article. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-container">
      <div className="edit-article-header">
        <h1 className="edit-article-title">Modifier l'article</h1>
        <p className="edit-article-subtitle">Mettez à jour les informations de votre produit gaming</p>
      </div>

      
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      
      <div className="edit-article-form">
        <form onSubmit={handleSubmit}>
          <h3 className="edit-article-section-title">
            📝 Informations de base
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Nom de l'article *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Ex: Valorant - 1000 VP"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">
                Prix (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-input"
                placeholder="9.99"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Décrivez votre article gaming..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          
          <h3 className="edit-article-section-title">
            🏷️ Catégorisation
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Catégorie *
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="game">
                Jeu *
              </label>
              <select
                id="game"
                name="game"
                className="form-select"
                value={formData.game}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un jeu</option>
                {games.map(game => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tags">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="form-input"
              placeholder="fps, battle-royale, competitive"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          
          <h3 className="edit-article-section-title">
            🎮 Détails du produit
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="digitalCode">
                Code numérique/Clé
              </label>
              <input
                type="text"
                id="digitalCode"
                name="digitalCode"
                className="form-input"
                placeholder="Code ou clé d'activation"
                value={formData.digitalCode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="stock">
                Stock disponible
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="form-input"
                placeholder="100"
                min="0"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="image">
              URL de l'image
            </label>
            <input
              type="url"
              id="image"
              name="image"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          
          <h3 className="edit-article-section-title">
            ⚙️ Options
          </h3>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                style={{ transform: 'scale(1.2)' }}
              />
              <span className="form-label" style={{ marginBottom: 0 }}>
                ⭐ Article en vedette
              </span>
            </label>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Cet article apparaîtra en première position sur la page d'accueil
            </p>
          </div>

          
          <div className="btn-group">
            <button 
              type="submit" 
              className={`btn btn-update ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Mise à jour en cours...' : '✅ Mettre à jour l\'article'}
            </button>
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              ❌ Annuler
            </button>
          </div>
        </form>
      </div>

      
      {formData.name && (
        <div className="admin-card" style={{ marginTop: '2rem' }}>
          <h3 style={{ color: 'var(--edit-article-accent)', marginBottom: '1rem' }}>
            👁️ Aperçu des modifications
          </h3>
          <div style={{ 
            background: 'var(--secondary-bg)', 
            padding: '1.5rem', 
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--edit-article-accent)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🎮
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  {formData.name}
                  {formData.featured && <span style={{ marginLeft: '0.5rem' }}>⭐</span>}
                </h4>
                {formData.description && (
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                    {formData.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {formData.price && (
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--edit-article-accent)' }}>
                      {formData.price}€
                    </span>
                  )}
                  {formData.category && <span className="badge badge-user">{formData.category}</span>}
                  {formData.game && <span className="badge badge-pending">{formData.game}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditArticle;

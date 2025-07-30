import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/EditArticle.css';

function EditArticle() {
  const { id: articleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    descriptions: '',
    price: '',
    category: '',
    images: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { id: 1, name: 'Monnaies virtuelles' },
    { id: 2, name: 'Pass de bataille' },
    { id: 3, name: 'Skins' },
    { id: 4, name: 'DLC' },
    { id: 5, name: 'Cartes cadeaux' },
    { id: 6, name: 'Abonnements' },
  ];

  const findCategoryIdByName = (name) => {
    const cat = categories.find((c) => c.name === name);
    return cat ? cat.id : '';
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!articleId) {
        setMessage(' Aucun ID de produit trouvé.');
        return;
      }

      setIsLoading(true);
      setMessage('');

      try {
        const response = await fetch(`http://localhost:8000/product/${articleId}`, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await response.json();
        if (data.id) {
          setFormData({
            name: data.name || '',
            descriptions: data.descriptions || '',
            price: data.price || '',
            category: findCategoryIdByName(data.category),
            images: data.images ? data.images.map((url) => ({ url })) : [],
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [articleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const requestData = {
      name: formData.name,
      descriptions: formData.descriptions,
      price: parseFloat(formData.price),
      category: parseInt(formData.category),
      images: formData.images,
    };

    try {
      const response = await fetch(`http://localhost:8000/product/admin/${articleId}/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        setMessage(`Erreur HTTP ${response.status}`);
        return;
      }
      setMessage('Article mis à jour avec succès !');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate('/admin/dashboard');

  return (
    <div className="admin-container">
      <div className="edit-article-header">
        <h1 className="edit-article-title">Modifier l'article</h1>
        <p className="edit-article-subtitle">Mettez à jour les informations de votre produit gaming</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="edit-article-form">
        <form onSubmit={handleSubmit}>
          <h3 className="edit-article-section-title"> Informations de base</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nom de l'article *</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Prix (€) *</label>
              <input
                type="number"
                name="price"
                id="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="descriptions">Description</label>
            <textarea
              name="descriptions"
              id="descriptions"
              className="form-textarea"
              value={formData.descriptions}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <h3 className="edit-article-section-title">🏷️ Catégorisation</h3>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Catégorie *</label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <h3 className="edit-article-section-title"> Images</h3>

          <div className="form-group">
            <label className="form-label">Importer des images</label>
            <input type="file" multiple onChange={handleImageChange} />
          </div>

          <div className="btn-group">
            <button 
              type="submit" 
              className={`btn btn-update ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Mise à jour en cours...' : 'Mettre à jour l\'article'}
            </button>
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      {formData.name && (
        <div className="admin-card" style={{ marginTop: '2rem' }}>
          <h3 style={{ color: 'var(--edit-article-accent)', marginBottom: '1rem' }}>
            👁️ Aperçu des modifications
          </h3>
          <div style={{ background: 'var(--secondary-bg)', padding: '1.5rem', borderRadius: '8px' }}>
            <h4>{formData.name}</h4>
            <p>{formData.descriptions}</p>
            <p>
              <strong>Prix :</strong> {formData.price} €
            </p>
            <p>
              <strong>Catégorie :</strong>{' '}
              {categories.find((c) => c.id === parseInt(formData.category))?.name}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {formData.images.map((img, idx) => (
                <img key={idx} src={img.url} alt={`img-${idx}`} style={{ width: 100, borderRadius: 4 }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditArticle;

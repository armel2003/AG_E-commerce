import React, { useState, useEffect } from 'react';
import '../style/promo.css';

function PromoManager() {
  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ value: '', product_id: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const productsRes = await fetch('http://localhost:8000/product');
      const productsData = await productsRes.json();
      setProducts(productsData);

      const promosRes = await fetch('http://localhost:8000/promos');
      const promosData = await promosRes.json();
      setPromos(promosData);
    } catch (error) {
      console.error('Erreur', error);
      setMessage('Erreur de chargement des données');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const body = {
        value: parseFloat(form.value),
        product_id: parseInt(form.product_id, 10),
      };

      if (editId) {
        await fetch(`http://localhost:8000/promos/update/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        setMessage('Promo mise à jour');
      } else {
        await fetch('http://localhost:8000/promos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        setMessage('Promo créée');
      }

      setForm({ value: '', product_id: '' });
      setEditId(null);
      fetchAll();
    } catch (error) {
      console.error('Erreur', error);
      setMessage('Erreur réseau');
    }
  };

  const handleEdit = (promo) => {
    setForm({ value: promo.value, product_id: promo.product });
    setEditId(promo.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette promo ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/promos/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('Promo supprimée');
        fetchAll();
      } else {
        setMessage('Erreur suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      setMessage('Erreur suppression');
    }
  };

  const toggleNew = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/product/${productId}/toggle-new`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setMessage('Statut nouveauté mis à jour');
        fetchAll();
      } else {
        setMessage("Erreur lors de l'actualisation du produit");
      }
    } catch (error) {
      console.error('Erreur réseau', error);
      setMessage('Erreur réseau');
    }
  };

  const getPromoByProductId = (productId) =>
    promos.find((promotion) => promotion.product === productId);

  return (
    <div className="container">
      <h2 className="title">🎁 Gestion des promotions</h2>

      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">Produit :</label>
          <select
            name="product_id"
            value={form.product_id}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">-- Choisir un produit --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Valeur (entre 0 et 1) :</label>
          <input
            type="number"
            name="value"
            step="0.01"
            min="0"
            max="1"
            value={form.value}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <button type="submit" className="button">
          {editId ? 'Mettre à jour' : 'Créer promo'}
        </button>
      </form>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="th">ID Produit</th>
              <th className="th">Nom</th>
              <th className="th">Réduction</th>
              <th className="th">Prix Avant</th>
              <th className="th">Prix Après</th>
              <th className="th">Nouveauté</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const promo = getPromoByProductId(product.id);
              return (
                <tr key={product.id}>
                  <td className="td">{product.id}</td>
                  <td className="td">{product.name}</td>
                  <td className="td">
                    {promo ? `${(promo.value * 100).toFixed(0)}%` : '—'}
                  </td>
                  <td className="td">
                    {product.originalPrice
                      ? parseFloat(product.originalPrice).toFixed(2)
                      : parseFloat(product.price).toFixed(2)}{' '}
                    €
                  </td>
                  <td className="td">
                    {promo
                      ? (product.price * (1 - promo.value)).toFixed(2) + ' €'
                      : '—'}
                  </td>
                  <td className="td">
                    {product.isNew ? ' Oui' : 'Non'}
                  </td>
                  <td className="td">
                    {promo ? (
                      <>
                        <button
                          onClick={() => handleEdit(promo)}
                          className="button-secondary button-edit"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="button-secondary button-delete"
                        >
                          🗑️ Supprimer
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setForm({ value: '', product_id: product.id });
                          setEditId(null);
                        }}
                        className="button-secondary button-create"
                      >
                        ➕ Créer promo
                      </button>
                    )}
                    <br />
                    <button
                      onClick={() => toggleNew(product.id)}
                      className="button-create"
                    >
                      {product.isNew ? ' Enlever nouveauté' : ' Marquer comme nouveauté'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table> 
      )}
    </div>
  );
}

export default PromoManager;


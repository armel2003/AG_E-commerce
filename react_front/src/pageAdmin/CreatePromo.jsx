import React, { useState, useEffect } from 'react';

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
            const [productsRes, promosRes] = await Promise.all([
                fetch('http://localhost:8000/product'),
                fetch('http://localhost:8000/promos')
            ]);

            const productsData = await productsRes.json();
            const promosData = await promosRes.json();

            setProducts(productsData);
            setPromos(promosData);
        } catch (error) {
            console.error('Erreur chargement des données:', error);
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
            const url = editId
                ? `http://localhost:8000/promos/update/${editId}`
                : 'http://localhost:8000/promos/create';

            const method = editId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de l\'envoi');
            }

            setMessage(editId ? 'Promo mise à jour' : 'Promo créée');
            setForm({ value: '', product_id: '' });
            setEditId(null);
            fetchAll();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleEdit = (promo) => {
        setForm({ value: promo.value, product_id: promo.product });
        setEditId(promo.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette promo ?')) return;

        try {
            await fetch(`http://localhost:8000/promos/delete/${id}`, { method: 'DELETE' });
            fetchAll();
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
    };

    const getPromoByProductId = (productId) => {
        return promos.find(p => p.product === productId);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>🎁 Gestion des promotions</h2>

            {message && <p style={{ color: 'green' }}>{message}</p>}

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div>
                    <label>Valeur (entre 0 et 1) :</label>
                    <input
                        type="number"
                        name="value"
                        step="0.01"
                        min="0"
                        max="1"
                        value={form.value}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>ID produit :</label>
                    <input
                        type="number"
                        name="product_id"
                        value={form.product_id}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">
                    {editId ? 'Mettre à jour' : 'Créer promo'}
                </button>
            </form>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>ID Produit</th>
                            <th>Nom</th>
                            <th>Réduction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            const promo = getPromoByProductId(product.id);
                            return (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{promo ? `${(promo.value * 100).toFixed(0)}%` : '—'}</td>
                                    <td>
                                        {promo ? (
                                            <>
                                                <button onClick={() => handleEdit(promo)}>✏️ Modifier</button>
                                                <button onClick={() => handleDelete(promo.id)}>🗑️ Supprimer</button>
                                            </>
                                        ) : (
                                            <button onClick={() => {
                                                setForm({ value: '', product_id: product.id });
                                                setEditId(null);
                                            }}>
                                                ➕ Créer promo
                                            </button>
                                        )}
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

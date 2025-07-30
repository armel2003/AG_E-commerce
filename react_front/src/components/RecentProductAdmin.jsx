import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentProducts = ({ count = 4 }) => {
const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);
const navigate = useNavigate();

useEffect(() => {
fetch('http://localhost:8000/product')
.then(response => response.json())
.then(data => {
    console.log('✅ Tous les produits récupérés depuis l\'API :', data);
const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
setProducts(sorted.slice(0, count));
setLoading(false);
})
.catch(error => {
console.error('Erreur lors du chargement des produits :', error);
setLoading(false);
});
}, [count]);

const handleEditProduct = (productId) => {
console.log(`Redirection vers /edit_produit_admin/${productId}`);
navigate(`${productId}/edit`); 
};


const handleDeleteProduct = async (productId) => {
if (!window.confirm(" Êtes-vous sûr de vouloir supprimer ce produit ?")) {
return;
}

try {
const response = await fetch(`http://localhost:8000/product/admin/${productId}/delete`, {
    method: 'DELETE',
    headers: {
    'Accept': 'application/json',
    },
});

let data = null;
if (response.status !== 204) {
    data = await response.json();
}

if (response.ok) {
    alert(data?.message || " Produit supprimé avec succès !");
    window.location.reload();
} else {
    alert("  erreur.");
}
} catch (error) {
alert(" Une erreur réseau .");
}
};



if (loading) return <p>Chargement...</p>;

return (
<div className="">
<div className="">
<h3 style={{ color: 'var(--neon-purple)', marginBottom: '1rem' }}>🎮 Produits</h3>
<div className="table-container">
    {products.map(prod => (
    <div
        key={prod.id}
        style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
        cursor: 'pointer'
        }}
        onClick={() => navigate(`/product/${prod.id}`)}
    >
        <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
            {prod.name}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {prod.price} € • {prod.sales || 0} ventes
        </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className={`badge ${prod.status === 'Actif' ? 'badge-user' : 'badge-pending'}`}>
            {prod.stock > 0 ? prod.stock : 'Rupture de stock'}
        </span>
        <div className="article-actions">
                        <button
            className="btn-edit"
            onClick={(e) => {
                e.stopPropagation();
                handleEditProduct(prod.id);
            }}
            title="Modifier le produit"
            >
            ✏️ Modifier
            </button>
            <button
            className="btn-delete"
            onClick={(e) => {
                e.stopPropagation();
                handleDeleteProduct(prod.id);
            }}
            title="Supprimer le produit"
            >
            🗑️ Supprimer
            </button>
        </div>
        </div>
    </div>
    ))}
</div>
</div>
</div>
);
};

export default RecentProducts;

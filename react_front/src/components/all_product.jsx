import React, { useEffect, useState } from 'react';


const Product = () => {
const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);

useEffect(() => {
fetch('http://localhost:8000/product')
    .then(response => {
    if (!response.ok) {
        throw new Error('Erreur de chargement des produits');
    }
    return response.json();
    })
    .then(data => {
    setProducts(data);
    setLoading(false);
    })
    .catch(error => {
    console.error('Erreur :', error);
    setLoading(false);
    });
}, []);

if (loading) return <p>Chargement...</p>;

return (
<div>
    <h2>Produits similaires</h2>
    <div className="similar-products">
    {products.map(prod => (
        <div key={prod.id} className="product-card">
        <img
            src={prod.images?.[0] || 'placeholder.jpg'}
            alt={prod.name}
            className="similar-product-image"
        />
        <h4>{prod.name}</h4>
        <button
            onClick={() => alert(`Produit ${prod.name} ajouté au panier !`)}
            className="button"
        >
        Voir plus
        </button>
        </div>
    ))}
    </div>
</div>
);
};

export default Product;

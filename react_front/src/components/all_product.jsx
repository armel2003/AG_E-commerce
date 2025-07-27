import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./homedacceil.css";

const Product = () => {
const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);
const navigate = useNavigate();

useEffect(() => {
fetch('http://localhost:8000/product')
    .then(response => {
    if (!response.ok) {
        throw new Error('Erreur de chargement des produits');
    }
    return response.json();
    })
    .then(data => {
    const aléatoire = data.sort(() => Math.random() - 0.5);
    setProducts(aléatoire.slice(0, 4));
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
    <div className="homepage-grid">
    {products.map(prod => (
        <div key={prod.id} className="homepage-card" onClick={() => navigate(`/product/${prod.id}`)} style={{cursor: 'pointer'}}>
        <img
            src={prod.images?.[0] || 'placeholder.jpg'}
            alt={prod.name}
            className="homepage-card-img"
        />
        <h4>{prod.name}</h4>
        </div>
    ))}
    </div>
</div>
);
};

export default Product;

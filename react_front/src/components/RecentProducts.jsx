import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/homedacceil.css';

const RecentProducts = ({ count = 4 }) => {
const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);
const navigate = useNavigate();

useEffect(() => {
fetch('http://localhost:8000/product')
    .then(response => response.json())
    .then(data => {
    const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setProducts(sorted.slice(0, count));
    setLoading(false);
    });
}, [count]);

if (loading) return <p>Chargement...</p>;

return (
<div className="product-grid">
    {products.map(prod => (
    <div key={prod.id} className="product-card" onClick={() => navigate(`/product/${prod.id}`)} style={{cursor: 'pointer'}}>
        <img
        src={prod.images?.[0] || 'placeholder.jpg'}
        alt={prod.name}
        className="product-card-img"
        />
        <div className="product-card-content">
        <p className="product-title">{prod.name}</p>
        <span className="product-price">{prod.price} €</span>
        </div>
    </div>
    ))}
</div>
);
};

export default RecentProducts;

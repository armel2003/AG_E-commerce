import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../style/homedacceil.css';

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
            <div className="product-grid">
                {products.map(prod => (
                    <div key={prod.id} className="product-card" onClick={() => navigate(`/product/${prod.id}`)}
                         style={{cursor: 'pointer'}}>
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
        </div>
    );
};

export default Product;

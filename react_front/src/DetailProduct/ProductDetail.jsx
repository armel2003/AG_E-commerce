import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './detailProduct.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allproducts, setAllProducts] = useState([]);

useEffect(() => {
    fetch(`http://localhost:8000/product/${id}`)
    .then(response => {
        console.log('Response received:', response);
        if (!response.ok) {
        throw new Error('Impossible de charger le produit');
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Product data:', data);
        setProduct(data); 
        setLoading(false);
    });

    // autre product
    fetch('http://localhost:8000/product')
    .then(response => {
        if (!response.ok) {
        throw new Error('Impossible de charger les produits');
        }
        return response.json();
    })
    .then(data => {
        console.log('All products data:', data);
        setAllProducts(data);
        setLoading(false);
    });
}, [id]);

if (loading) return <p>Chargement🎮...</p>;
if (!product) return <p>Produit non trouvé.</p>;

return (
    <div className="product-detail-container">
    <h2>Détails du jeu</h2>
    
    <div className="product-card-detail">
        {product.images && product.images.length > 0 ? (
        <img 
            src={product.images[0]} 
            alt={`Image du produit ${product.name}`} 
            className="product-image"
        />
        ) : (
        <p>Aucune image disponible.</p>
        )}
        <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.descriptions}</p>
        <p>Catégorie : {product.category}</p>
        <p>Prix : {product.price} €</p>
        <p>Date: {product.createdAt}</p>
        <button onClick={() => alert('Produit ajouté au panier !')} className='button'>
            Ajouter au panier
        </button>
        </div>
    </div>
    <p>Avis</p>
    <p>Produits Similaires</p>
    <div className="similar-products-row">
        {allproducts.map((prod) => (
        <div key={prod.id} className="product-card">
            <img 
            src={prod.images && prod.images.length > 0 ? prod.images[0] : 'placeholder.jpg'} 
            alt={prod.name} 
            className="similar-product-image"
            />
            <h4>{prod.name}</h4>
            <button onClick={() => navigate(`/product/${prod.id}`)} className='button'>
            Voir plus
            </button>
            </div>
        ))}
    </div>
    </div> 
    );
};

export default ProductDetail;

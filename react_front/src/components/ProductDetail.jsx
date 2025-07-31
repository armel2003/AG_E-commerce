import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/detailProduct.css'; 
import ProductDetailCard from '../page/ProductDetailCard.jsx';

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

if (loading) return (
  <div className="product-page">
    <div className="loading">
      <div className="spinner"></div>
      <span>Chargement du jeu 🎮...</span>
    </div>
  </div>
);


return (
    <div className="product-page">
      <div className="product-container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Accueil</span>
          <span>›</span>
          <span>{product?.category}</span>
          <span>›</span>
          <span>{product?.name}</span>
        </div>

        <h2 className="section-title">Détails du jeu</h2>
        <ProductDetailCard product={product} />
        
        <h2 className="section-title">Avis des joueurs</h2>
        <div className="avis-section">
          <ul>
            <li><strong>Marie</strong> : Super jeu, je recommande ! ⭐⭐⭐⭐⭐</li>
            <li><strong>Lucas</strong> : Graphismes magnifiques, très fun. ⭐⭐⭐⭐</li>
            <li><strong>Sophie</strong> : Bon rapport qualité/prix. ⭐⭐⭐⭐</li>
          </ul>
        </div>
        
        <div className="similar-products-section">
          <h2 className="section-title">Produits Similaires</h2>
          <div className="similar-products-row">
            {allproducts.map((prod) => (
              <div key={prod.id} className="product-card" onClick={() => navigate(`/product/${prod.id}`)}>
                <img 
                  src={prod.images && prod.images.length > 0 ? prod.images[0] : 'placeholder.jpg'} 
                  alt={prod.name} 
                  className="similar-product-image"
                />
                <h4>{prod.name}</h4>
                <button className='button'>
                  Voir plus
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div> 
    );
};

export default ProductDetail;

import React from 'react';
//import './detailProduct.css';
import '../style/detailProduct.css'; 

const ProductDetailCard = ({ product }) => {
if (!product) return null;

return (
    <div className="container_card">
      <div className="image_product">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={`Image du produit ${product.name}`} 
            className="image-custom"
          />
        ) : (
          <div className="no-image">
            <p>Aucune image disponible.</p>
          </div>
        )}
      </div>
      
      <div className="detail_product">
        <h2>{product.name}</h2>
        <p className="description">{product.descriptions}</p>
        
        <div className="product-info-grid">
          <div className="info-item">
            <div className="info-label">Catégorie</div>
            <div className="info-value">{product.category}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Prix</div>
            <div className="info-value price">{product.price} €</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Date de sortie</div>
            <div className="info-value">{new Date(product.createdAt).toLocaleDateString('fr-FR')}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Disponibilité</div>
            <div className="info-value" style={{color: '#10b981'}}>En stock</div>
          </div>
        </div>
        
        <button 
          onClick={() => alert('Produit ajouté au panier !')} 
          className='button'
        >
          🛒 Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductDetailCard;

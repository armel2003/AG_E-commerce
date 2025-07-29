import React from 'react';
import './detailProduct.css';

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
        <p>Aucune image disponible.</p>
        )}
        </div>
        <div className="detail_product">
        <h2>{product.name}</h2>
        <p className="description product">{product.descriptions}</p>
        <p><strong>Catégorie :</strong> {product.category}</p>
        <p><strong>Prix :</strong> {product.price} €</p>
        <p><strong>Date :</strong> {product.createdAt}</p>
        <button onClick={() => alert('Produit ajouté au panier !')} className='button'>
        Ajouter au panier
        </button>
    </div>
    </div>
  );
};

export default ProductDetailCard;

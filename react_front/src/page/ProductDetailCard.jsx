import React, { useEffect, useState } from "react";
import "../style/detailProduct.css";
import { createCartItem } from "../redux/cart";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductDetailCard = ({ product }) => {
const dispatch = useDispatch();
const navigate = useNavigate();

const [promos, setPromos] = useState([]);
const [promoInfo, setPromoInfo] = useState({
isPromo: false,
promoValue: 0,
discountedPrice: null,
originalPrice: null,
});

useEffect(() => {
if (!product) {
    setPromoInfo({
    isPromo: false,
    promoValue: 0,
    discountedPrice: null,
    originalPrice: null,
    });
    return;
}

fetch("http://localhost:8000/promos")
    .then((res) => res.json())
    .then((promosData) => {
    setPromos(promosData);

    const promo = promosData.find((p) => p.product === product.id);

    if (promo && product.originalPrice) {
        setPromoInfo({
        isPromo: true,
        promoValue: promo.value,
        discountedPrice: parseFloat(product.price).toFixed(2),
        originalPrice: parseFloat(product.originalPrice).toFixed(2),
        });
    } else {
        setPromoInfo({
        isPromo: false,
        promoValue: 0,
        discountedPrice: null,
        originalPrice: null,
        });
    }
    })
    .catch((err) => console.error("Erreur promos :", err));
}, [product]);

if (!product) {
return <div>Chargement du produit...</div>;
}

const token = localStorage.getItem("userToken");

const handleAddToCart = () => {
if (!token) {
    navigate("/login");
    return;
}
dispatch(createCartItem({ ...product, quantity: 1 }));
};

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
    <h2>
        {product.name}{" "}
        {promoInfo.isPromo && (
        <span
            style={{
            color: "red",
            fontWeight: "bold",
            marginLeft: "10px",
            fontSize: "0.9em",
            }}
            title={`Promotion -${Math.round(promoInfo.promoValue * 100)}%`}
        >
            🎁 Promo
        </span>
        )}
    </h2>
    <p className="description">{product.descriptions}</p>

    <div className="product-info-grid">
        <div className="info-item">
        <div className="info-label">Catégorie</div>
        <div className="info-value">{product.category}</div>
        </div>

        <div className="info-item">
        <div className="info-label">Prix</div>
        <div className="info-value price">
            {promoInfo.isPromo && promoInfo.originalPrice ? (
            <>
                <span>
                {promoInfo.originalPrice} €
                </span>{" "}
                --{" "}
                <span className="newprice">{promoInfo.discountedPrice} €</span>
            </>
            ) : (
            <span>{parseFloat(product.price).toFixed(2)} €</span>
            )}
        </div>
        </div>

        <div className="info-item">
        <div className="info-label">Date de sortie</div>
        <div className="info-value">
            {new Date(product.createdAt).toLocaleDateString("fr-FR")}
        </div>
        </div>

        <div className="info-item">
        <div className="info-label">Disponibilité</div>
        <div
            className="info-value"
            style={{ color: product.stock > 0 ? "#10b981" : "red" }}
        >
            {product.stock > 0 ? "Stock" : "Rupture de stock"}
        </div>
        </div>
    </div>

    <button
        className="button"
        disabled={product.stock <= 0}
        onClick={handleAddToCart}
    >
        🛒 Ajouter au panier
    </button>
    </div>
</div>
);
};

export default ProductDetailCard;

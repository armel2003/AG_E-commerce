import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../asset/pentakeys_logo.png";
import "../style/Boutique.css";
import { useDispatch } from "react-redux"
import { createCartItem } from "../redux/cart" 
import FloatingCartButton from "../components/FloatingCartButton"; 



export default function Boutique() {
const [products, setProducts] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [sortOption, setSortOption] = useState("price-asc");
const navigate = useNavigate();
const dispatch = useDispatch()


useEffect(() => {
fetch("http://localhost:8000/product")
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.error(err));
}, []);

const handleSort = (prods) => {
switch (sortOption) {
    case "price-asc":
    return prods.sort((a, b) => a.price - b.price);
    case "price-desc":
    return prods.sort((a, b) => b.price - a.price);
    case "date":
    return prods.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "popular":
    return prods.sort((a, b) => b.sales - a.sales);
    default:
    return prods;
}
};

const filtered = products.filter((p) =>
p.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const sorted = handleSort([...filtered]);

return (
<div className="boutique-root">
    {/* Header */}
    <header className="homepage-header">
    <div className="flex items-center gap-2">
        <div className="logopentakeys">
        <img
            src={logo}
            alt="Logo PentaKeys"
            style={{ width: 90, height: 90 }}
        />
        </div>
    </div>
    <nav className="homepage-nav">
        <Link to="/" className="nav-btn">Accueil</Link>
        <Link to="/boutique" className="nav-btn">Boutique</Link>
        <Link to="/kits" className="nav-btn">Kits</Link>
        <Link to="/mystere" className="nav-btn">Clés Mystères</Link>
    </nav>

    <div className="search-bar-container">
        <input
        type="text"
        placeholder="Rechercher un jeu..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        />
    </div>

    <div className="homepage-actions">
    <Link to="/login">
<img
alt="Account Icon"
width="24"
height="24"
src="https://www.svgrepo.com/show/453660/account.svg"
style={{
    cursor: "pointer",
    filter: "invert(100%)",
}}
/>
</Link>
<FloatingCartButton />

    </div>
    </header>

    {/* Banner */}
    <section className="boutique-banner">
    <h1>La Boutique PentaKeys</h1>
    <p>Découvre toutes nos offres à prix cassés</p>
    </section>

    {/* Filtres */}
    <div className="filters-bar">
    <div className="filter-dropdown">
        <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        >
        <option value="price-asc">Trier par</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="date">Date de sortie</option>
        <option value="popular">Tendances</option>
        </select>
    </div>
    <div className="filter-dropdown">
        <select>
        <option>Plateforme</option>
        <option value="pc">PC</option>
        <option value="xbox">Xbox</option>
        <option value="ps">PlayStation</option>
        </select>
    </div>
    <div className="filter-dropdown">
        <select>
        <option>Genre</option>
        <option value="fps">FPS</option>
        <option value="rpg">RPG</option>
        <option value="strat">Stratégie</option>
        </select>
    </div>
    </div>

    {/* Produits */}
    <section className="boutique-products">
    {sorted.length > 0 ? (
        <div className="product-grid">
        {sorted.map((product) => (
            <div
            className="product-card"
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ cursor: "pointer" }}
            >
            <img src={product.images?.[0]} alt={product.name} />
            <p>{product.name}</p>
            <span>{product.price} €</span>
                            <button
                onClick={(e) => {
                    e.stopPropagation();
                     console.log("Bouton cliqué ✅");
                    dispatch(createCartItem(product));
                }}
                >
                Ajouter au panier
                </button>
            </div>
        ))}
        </div>
    ) : (
        <p>Aucun produit trouvé.</p>
    )}
    </section>
</div>
);
}
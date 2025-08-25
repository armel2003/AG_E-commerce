import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import logo from "../asset/pentakeys_logo.png";
import "../style/Boutique.css";
import "../style/homedacceil.css";
import { createCartItem, setCartItems } from "../redux/cart";
import Cart from "../components/Cart";

export default function Boutique() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");
  const [showCartModal, setShowCartModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("userToken");

useEffect(() => {
  fetch("http://localhost:8000/product")
    .then((res) => res.json())
    .then((productsData) => {
      fetch("http://localhost:8000/promos")
        .then((res) => res.json())
        .then((promosData) => {
          const filtered = productsData.filter(
            (p) => p.category !== "Cartes prépayées"
          );
          const enriched = filtered.map((prod) => {
            const promo = promosData.find((p) => p.product === prod.id);
            let newProduct = { ...prod };
            if (promo) {
              newProduct.isPromo = true;
              newProduct.promoValue = promo.value;
              newProduct.discountedPrice = (
                prod.price *(1 - promo.value)).toFixed(2);
            } else {
              newProduct.isPromo = false;
            }

            return newProduct;
          });

          setProducts(enriched);
        })
        .catch((err) => console.error("Erreur promos :", err));
    })
    .catch((err) => console.error("Erreur produits :", err));
}, []);

  useEffect(() => {
    fetch("http://localhost:8000/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur catégories :", err));
  }, []);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => dispatch(setCartItems(data)))
        .catch((err) => console.error("Erreur panier :", err));
    }
  }, [token, dispatch]);

  const handleAddToCart = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8000/cart/${product.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => dispatch(createCartItem({ ...product, quantity: 1 })))
      .catch((err) => console.error("Erreur ajout au panier :", err));
  };

  const handleSort = (items) => {
    const sorted = [...items];
    if (sortOption === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "date") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "popular") {
      sorted.sort((a, b) => b.sales - a.sales);
    }
    return sorted;
  };

  const filtered = products
    .filter((p) =>
      selectedCategory ? p.category === selectedCategory : true
    )
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sorted = handleSort(filtered);
  const totalItems = (cart.items || []).reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <div className="boutique-root">
      <header className="homepage-header">
        <div className="flex items-center gap-2">
          <div className="logopentakeys">
            <img src={logo} alt="Logo PentaKeys" style={{ width: 90, height: 90 }} />
          </div>
          {user && (
              <div className="user-welcome" style={{ marginLeft: 20, fontWeight: 'bold' }}>
                        Bonjour, {user} 🎮
                    </div>
          )}
        </div>

        <nav className="homepage-nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/boutique" className="nav-link">🛒 Clés de jeux</Link>
          <Link to="/prepayes" className="nav-link">🎁 Cartes prépayées</Link>
        </nav>

        <div className="search-bar-container" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Rechercher un jeu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && filtered.length > 0 && (
            <div className="search-dropdown">
              {filtered.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="dropdown-item"
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    setSearchTerm("");
                  }}
                >
                  <img src={product.images?.[0]} alt={product.name} className="dropdown-thumb" />
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="homepage-actions">
          {!user ? (
            <button onClick={() => navigate("/login")}>Connexion</button>
          ) : (
            <button
              className="account-btn"
              onClick={() =>
                navigate(`/account/${localStorage.getItem("userId")}`)
              }
            >
              Mon compte
            </button>
          )}
          <button
            onClick={() => setShowCartModal(true)}
            className="cart-header-button"
          >
            🛒 Panier{" "}
            {totalItems > 0 && <span className="cart-badge-header">{totalItems}</span>}
          </button>
        </div>
      </header>
      <section className="boutique-banner">
        <h1>La Boutique PentaKeys</h1>
        <p>Découvre toutes nos offres à prix cassés</p>
      </section>
      <div className="filters-bar">
      <div className="filter-dropdown">
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="date">Date de sortie</option>
          <option value="popular">Tendances</option>
        </select>
        </div>
        <div className="filter-dropdown">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        </div>
      </div>
      <section className="boutique-products">
        {sorted.length > 0 ? (
          <div className="product-grid">
            {sorted.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.images?.[0]} alt={product.name} />
                <p onClick={() => navigate(`/product/${product.id}`)}>
                  {product.name}
                </p>
                {product.isPromo && (
                <span title="En promotion">
                🎁 Promo {Math.round(product.promoValue * 100)}%
                </span>
                )}
                {product.isPromo ? (
                  <div>
                    <span style={{ textDecoration: "line-through", color: "gray" }}>
                      {parseFloat(product.price).toFixed(2)} €
                    </span>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {product.discountedPrice} €
                    </span>
                  </div>
                ) : (
                  <span>{parseFloat(product.price).toFixed(2)} €</span>
                )}
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="add-product"
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
      {showCartModal &&
        createPortal(
          <Cart onClose={() => setShowCartModal(false)} products={products} />,
          document.body
        )}
    </div>
  );
}

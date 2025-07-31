import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../asset/pentakeys_logo.png";
import "../style/Boutique.css";

export default function Boutique() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");
  const navigate = useNavigate();

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
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="dropdown-thumb"
                  />
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          )}
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

          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z" />
            </svg>
          </button>
        </div>
      </header>

      <section className="boutique-banner">
        <h1>La Boutique PentaKeys</h1>
        <p>Découvre toutes nos offres à prix cassés</p>
      </section>

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

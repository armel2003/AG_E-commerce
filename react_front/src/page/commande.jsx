import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cart";
import LoginForm from "./LoginForm";
import "../style/commande.css";

export default function Commande() {
  const cart = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [address, setAddress]     = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    let email = "";
    try {
      const raw = JSON.parse(localStorage.getItem("user") || "null");
      email = typeof raw === "string" ? raw : raw?.email || "";
    } catch {
      const raw = localStorage.getItem("user");
      if (raw && !raw.startsWith("{")) email = raw;
    }
    if (token) { setIsLogged(true); setUserEmail(email || ""); }
  }, []);

  const validate = () => {
    const e = {};
    if (!firstName) e.firstName = "Prénom obligatoire.";
    if (!lastName)  e.lastName  = "Nom obligatoire.";
    if (!address)   e.address   = "Adresse obligatoire.";
    if (!/^\d{16}$/.test(String(cardNumber).replace(/\s/g, ""))) e.cardNumber = "Numéro invalide.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) e.expiryDate = "Format MM/AA.";
    if (!/^\d{3,4}$/.test(cvv)) e.cvv = "CVV invalide.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    dispatch(clearCart());
    setShowSuccess(true);
    setTimeout(() => navigate("/"), 1500);
    setLoading(false);
  };

  const onLoginSuccess = payload => {
    const u = payload?.user ?? payload;
    const email = typeof u === "string" ? u : u?.email || "";
    setIsLogged(true); setUserEmail(email); setShowLogin(false);
  };

  const total = Number(cart.totalPrice || 0);
  const payable = (total * 1.02).toFixed(2);

  return (
    <div className="commande-container">
      <div className="commande-header">
        <h1 className="commande-title">Finaliser ma commande</h1>
      </div>

      <div className="commande-content">
        <div className="order-form">
          {!isLogged ? (
            <div className="login-section">
              <p>Connecte-toi pour commander :</p>
              <button className="btn btn-secondary" onClick={() => setShowLogin(true)}>
                Se connecter
              </button>
            </div>
          ) : (
            <div className="user-profile">
              <h3 className="section-title">Profil connecté</h3>
              <div>Email : {userEmail || "—"}</div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  localStorage.removeItem("userToken");
                  localStorage.removeItem("user");
                  setIsLogged(false);
                  setUserEmail("");
                  setFirstName(""); setLastName(""); setAddress("");
                  setCardNumber(""); setExpiryDate(""); setCvv("");
                }}
              >
                Se déconnecter
              </button>
            </div>
          )}

          <div className="form-section">
            <h2 className="section-title">Informations de livraison</h2>
            <div className="form-row">
              <div>
                <input
                  className={`form-input${errors.firstName ? " error" : ""}`}
                  placeholder="Prénom *"
                  value={firstName}
                  onChange={e=>setFirstName(e.target.value)}
                />
                {errors.firstName && <div className="error-text">{errors.firstName}</div>}
              </div>
              <div>
                <input
                  className={`form-input${errors.lastName ? " error" : ""}`}
                  placeholder="Nom *"
                  value={lastName}
                  onChange={e=>setLastName(e.target.value)}
                />
                {errors.lastName && <div className="error-text">{errors.lastName}</div>}
              </div>
            </div>
            <div className="form-group">
              <input
                className={`form-input${errors.address ? " error" : ""}`}
                placeholder="Adresse *"
                value={address}
                onChange={e=>setAddress(e.target.value)}
              />
              {errors.address && <div className="error-text">{errors.address}</div>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Paiement</h2>
            <div className="form-group">
              <input
                className={`form-input${errors.cardNumber ? " error" : ""}`}
                placeholder="Numéro de carte *"
                value={cardNumber}
                onChange={e=>setCardNumber(e.target.value)}
              />
              {errors.cardNumber && <div className="error-text">{errors.cardNumber}</div>}
            </div>
            <div className="form-row">
              <div>
                <input
                  className={`form-input${errors.expiryDate ? " error" : ""}`}
                  placeholder="MM/AA *"
                  value={expiryDate}
                  onChange={e=>setExpiryDate(e.target.value)}
                />
                {errors.expiryDate && <div className="error-text">{errors.expiryDate}</div>}
              </div>
              <div>
                <input
                  className={`form-input${errors.cvv ? " error" : ""}`}
                  placeholder="CVV *"
                  value={cvv}
                  onChange={e=>setCvv(e.target.value)}
                />
                {errors.cvv && <div className="error-text">{errors.cvv}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="cart-summary">
          <h2 className="section-title">Ma commande</h2>
          <div className="cart-items">
            {cart.items?.length ? cart.items.map(it => (
              <div key={it.id} className="cart-item">
                <span className="item-name">{it.name}</span>
                <span className="item-quantity">x{it.quantity}</span>
                <span className="item-price">{(it.price * it.quantity).toFixed(2)} €</span>
              </div>
            )) : <div className="cart-item">Panier vide</div>}
          </div>
          <div className="total-section">
            <div className="total-final"><span>Sous-total :</span><span>{total.toFixed(2)} €</span></div>
            <div className="total-final"><span>Frais de transaction (2%) :</span><span>{(total*0.02).toFixed(2)} €</span></div>
            <div className="total-final total-bold"><span>Total à payer :</span><span>{payable} €</span></div>
          </div>
          <button
            className="btn order-button"
            onClick={pay}
            disabled={loading || showSuccess || !cart.items?.length}
          >
            {loading ? "Traitement..." : `Payer - ${payable} €`}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="auth-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Merci pour votre achat !</div>
            </div>
            <p style={{color:"var(--text-secondary)"}}>
              Paiement validé. Redirection…
            </p>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="login-overlay">
          <div className="login-container">
            <button className="close-login-btn" onClick={() => setShowLogin(false)}>✕</button>
            <LoginForm onLoginSuccess={onLoginSuccess} onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

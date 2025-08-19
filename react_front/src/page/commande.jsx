import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cart';
import LoginForm from './LoginForm';
import '../style/commande.css';

export default function Commande() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      const userInfo = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        email: userInfo.email || '',
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || ''
      }));
    }
  }, []);

  // Rediriger si le panier est vide
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/boutique');
    }
  }, [cart.items, navigate]);

  const handleOrder = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setOrderProcessing(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vider le panier après commande réussie
      dispatch(clearCart());
      
      alert('Commande confirmée ! Merci pour votre achat.');
      navigate('/');
    } catch (error) {
      alert('Erreur lors du traitement de la commande');
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setShowLoginForm(false);
    setFormData(prev => ({
      ...prev,
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || ''
    }));
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="commande-container">
      <div className="commande-header">
        <h1 className="commande-title">Finaliser ma commande</h1>
      </div>
      
      <div className="commande-content">
        {/* Formulaire simple */}
        <div className="order-form">
          {/* Option de connexion simple */}
          {!isLoggedIn && (
            <div className="login-section">
              <p>Vous avez un compte ?</p>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowLoginForm(true)}
              >
                Se connecter
              </button>
            </div>
          )}

          {/* Informations essentielles */}
          <div className="form-section">
            <h2 className="section-title">Vos informations</h2>
            
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                className="form-input"
                placeholder="Prénom *"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
              <input
                type="text"
                className="form-input"
                placeholder="Nom *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Paiement simplifié */}
          <div className="form-section">
            <h2 className="section-title">Paiement</h2>
            
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Numéro de carte *"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                className="form-input"
                placeholder="MM/AA *"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                required
              />
              <input
                type="text"
                className="form-input"
                placeholder="CVV *"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            className="btn order-button"
            onClick={handleOrder}
            disabled={orderProcessing}
          >
            {orderProcessing ? 'Traitement...' : `Commander - ${cart.totalPrice.toFixed(2)} €`}
          </button>
        </div>

        {/* Résumé du panier simple */}
        <div className="cart-summary">
          <h2 className="section-title">Ma commande</h2>
          
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.images?.[0] || '/placeholder.jpg'} 
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-quantity">x{item.quantity}</div>
                  <div className="item-price">{(item.price * item.quantity).toFixed(2)} €</div>
                </div>
              </div>
            ))}
          </div>

          <div className="total-section">
            <div className="total-final">
              <span>Total:</span>
              <span>{cart.totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de connexion complet */}
      {showLoginForm && (
        <div className="login-overlay">
          <div className="login-container">
            <button 
              className="close-login-btn"
              onClick={() => setShowLoginForm(false)}
            >
              ✕
            </button>
            <LoginForm 
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setShowLoginForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

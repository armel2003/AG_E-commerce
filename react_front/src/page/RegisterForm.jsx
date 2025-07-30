import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/RegisterForm.css';
import logo from '../asset/pentakeys_logo.png';


const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    adress: '',
    zipcode: '',
    city: '',
    country: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setMessage(''); 
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage('');
  const dataToSend = {
    ...form,
    plainPassword: form.password
  };
  delete dataToSend.password;
  delete dataToSend.agreeTerms;
  console.log('Formulaire envoyé :', dataToSend);

  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      setMessage('Inscription réussie !');
      setForm({
        email: '', password: '', firstName: '', lastName: '', adress: '', zipcode: '', city: '', country: ''
      });
    } else {
      const result = await response.json();
      console.log('Erreur Symfony :', result.errors); 
      setMessage('Erreur lors de l\'inscription. Vérifiez les informations.');
    }
  } catch (error) {
    setMessage('Erreur lors de la connexion au serveur.');
    console.error('Erreur:', error);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="register-page">
      <div className="register-header">
        <div className="logo-container">
          <img src={logo} alt="PentaKeys Logo" className="logo-img" />
        </div>
        
        <div className="auth-form-container">
          <div className="form-background-effect"></div>
          <form className="auth-form register-mode" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Inscription</h2>
              <div className="form-subtitle">
                Créez votre compte PentaKeys
              </div>
            </div>

            {message && (
              <div className={message.includes('réussie') ? 'success-message' : 'error-message'}>
                {message}
              </div>
            )}

            <div className="input-group">
              <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}>
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>

              <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''}`}>
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>

              <div className={`input-wrapper ${focusedField === 'firstName' ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>

              <div className={`input-wrapper ${focusedField === 'lastName' ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>

              <div className={`input-wrapper ${focusedField === 'adress' ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="adress"
                  placeholder="Adresse"
                  value={form.adress}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('adress')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>

              <div className={`input-wrapper ${focusedField === 'zipcode' ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="zipcode"
                  placeholder="Code postal"
                  value={form.zipcode}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('zipcode')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>

              <div className={`input-wrapper ${focusedField === 'city' ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="city"
                  placeholder="Ville"
                  value={form.city}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>

              <div className={`input-wrapper ${focusedField === 'country' ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="country"
                  placeholder="Pays"
                  value={form.country}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('country')}
                  onBlur={() => setFocusedField('')}
                  required
                />
                <div className="input-line"></div>
              </div>
            </div>

            <button 
              type="submit" 
              className={`auth-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Inscription...</span>
                </div>
              ) : (
                <>
                  <span>S'inscrire</span>
                  <div className="btn-glow"></div>
                </>
              )}
            </button>

            <div className="form-footer">
              <p className="switch-mode" onClick={() => navigate('/login')}>
                Déjà un compte ? <span className="highlight">Se connecter</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;


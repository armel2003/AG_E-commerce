import React, { useState } from 'react';

const LoginForm = ({ onSwitchToRegister }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      alert('Connexion réussie !');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-form-container">
      <div className="form-background-effect"></div>
      <form className="auth-form login-mode" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Connexion</h2>
          <div className="form-subtitle">
            Accédez à votre compte PentaKeys
          </div>
        </div>

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
        </div>

        <button 
          type="submit" 
          className={`auth-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Connexion...</span>
            </div>
          ) : (
            <>
              <span>Se connecter</span>
              <div className="btn-glow"></div>
            </>
          )}
        </button>

        <div className="form-footer">
          <p className="switch-mode" onClick={onSwitchToRegister}>
            Pas encore de compte ? <span className="highlight">S'inscrire</span>
          </p>
          
          <p className="forgot-password">
            <span className="link">Mot de passe oublié ?</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

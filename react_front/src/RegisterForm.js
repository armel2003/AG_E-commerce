import React, { useState } from 'react';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username || form.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      alert('Inscription réussie !');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-form-container">
      <div className="form-background-effect"></div>
      <form className="auth-form register-mode" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Inscription</h2>
          <div className="form-subtitle">
            Créez votre compte PentaKeys
          </div>
        </div>

        <div className="input-group">
          <div className={`input-wrapper ${focusedField === 'username' ? 'focused' : ''} ${errors.username ? 'error' : ''}`}>
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              value={form.username}
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              required
            />
            <div className="input-line"></div>
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
          
          <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}>
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
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
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
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className={`input-wrapper ${focusedField === 'confirmPassword' ? 'focused' : ''} ${errors.confirmPassword ? 'error' : ''}`}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField('')}
              required
            />
            <div className="input-line"></div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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
          <p className="switch-mode" onClick={onSwitchToLogin}>
            Déjà inscrit ? <span className="highlight">Se connecter</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

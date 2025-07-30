import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username: form.email, 
        password: form.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Réponse de la connexion :', response);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user); 
        localStorage.setItem('userId', response.data.id); 
        console.log('Connexion réussie !');
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
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

        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

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
          <p className="switch-mode" onClick={() => navigate('/register')}>
            Pas encore de compte ? <span className="highlight">S'inscrire</span>
          </p>
          
          <p className="forgot-password">
            <span className="link">Mot de passe oublié ?</span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
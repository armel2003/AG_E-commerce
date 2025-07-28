import React, { useState } from 'react';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    setServerError('');

    try {
      // Création de FormData au lieu de JSON
      const formData = new FormData();
      formData.append('registration_form[email]', form.email);
      formData.append('registration_form[username]', form.username);
      formData.append('registration_form[plainPassword][first]', form.password);
      formData.append('registration_form[plainPassword][second]', form.confirmPassword);

      const response = await fetch('http://localhost:8000/register', {
        
        method: 'POST',
        body: formData,
      });
      const rawResponse = await response.text();
console.log('RAW RESPONSE:', rawResponse);


      const contentType = response.headers.get('content-type');
      let data = {};

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: 'Réponse inattendue du serveur.' };
      }

      if (response.ok) {
        alert('Inscription réussie ! Veuillez vérifier votre email pour la confirmation.');
      } else {
        setServerError(data.message || 'Erreur inconnue.');
      }
    } catch (error) {
      setServerError('Une erreur est survenue, veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
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

        {serverError && <div className="error-message">{serverError}</div>}

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

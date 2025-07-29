import React, { useState } from 'react';
import styleRegisterForm from './RegisterForm.css'; 

const RegisterForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    adress: '',
    zipcode: '',
    city: '',
    country: '',
    //agreeTerms: false
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
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
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Email :</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Prénom :</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Nom :</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Adresse :</label>
          <input
            type="text"
            name="adress"
            value={form.adress}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Code postal :</label>
          <input
            type="text"
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Ville :</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>Pays :</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {/* <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={handleChange}
              required
              style={{ marginRight: 8 }}
            />
            J'accepte les conditions d'utilisation
          </label>
        </div> */}
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: 10 }}>
          {isLoading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
      {message && <div style={{ marginTop: 16, color: message.includes('réussie') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default RegisterForm;


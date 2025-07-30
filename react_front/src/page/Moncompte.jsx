import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Moncompte() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [adress, setAdress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [erreur, setErreur] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log('Rôle de l’utilisateur :', role);
  console.log('Token récupéré :', token);

  useEffect(() => {
    fetch(`http://localhost:8000/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setEmail(data.email);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setAdress(data.adress);
        setCity(data.city);
        setCountry(data.country);
      })
      .catch(() => setErreur(true));
  }, [id]);

  if (!user) return null;
console.log('Données utilisateur :', user);
  const handleUpdate = () => {
  fetch(`http://localhost:8000/user/update/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      firstName,
      lastName,
      adress,
      city,
      country,
    }),
  })
    .then((res) => {
      console.log('Réponse brute :', res);
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log('Réponse JSON :', data);
      alert('Mise à jour réussie !');
      setUser(data);
    })
};


  return (
    <div>
      <h2>Mon compte</h2>
      <form>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Email :</strong></label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Nom :</strong></label><br />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Prénom :</strong></label><br />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Adresse :</strong></label><br />
          <input
            type="text"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Ville :</strong></label><br />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Pays :</strong></label><br />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <button type="button" onClick={handleUpdate}>
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}

export default Moncompte;

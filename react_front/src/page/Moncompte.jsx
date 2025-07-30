import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Moncompte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    adress: '',
    zipcode: '',
    city: '',
    country: ''
  });

  // Récupération des données
  useEffect(() => {
    fetch(`http://localhost:8000/user/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setForm({
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          adress: data.adress || '',
          zipcode: data.zipcode || '',
          city: data.city || '',
          country: data.country || ''
        });
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors du chargement");
      });
  }, [id]);

  // Mise à jour des données
  const handleUpdate = () => {
    fetch(`http://localhost:8000/user/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        zipcode: parseInt(form.zipcode),
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        alert("Mise à jour réussie !");
        setUser(data);
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de la mise à jour");
      });
  };

  if (!user) return null;

  const isAdmin = user.roles?.includes("ROLE_ADMIN");

  // Affichage
  return (
    <div>
      <h2>Mon compte</h2>

      {isAdmin && (
        <button onClick={() => navigate('/admin')}>
          Accéder à l'interface admin
        </button>
      )}

      <form>
        {[
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Nom', name: 'lastName' },
          { label: 'Prénom', name: 'firstName' },
          { label: 'Adresse', name: 'adress' },
          { label: 'Code postal', name: 'zipcode', type: 'number' },
          { label: 'Ville', name: 'city' },
          { label: 'Pays', name: 'country' }
        ].map(({ label, name, type = 'text' }) => (
          <div key={name} style={{ marginBottom: '10px' }}>
            <label><strong>{label} :</strong></label><br />
            <input
              type={type}
              value={form[name]}
              onChange={e => setForm({ ...form, [name]: e.target.value })}
              style={{ width: '300px' }}
            />
          </div>
        ))}

        <button type="button" onClick={handleUpdate}>
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}

export default Moncompte;

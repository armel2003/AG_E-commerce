import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Moncompte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken"); 
  console.log("Token utilisé : ", token); 

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    adress: '',
    zipcode: '',
    city: '',
    country: '',
    category: ''  // Ajout du champ catégorie
  });

  const [categories, setCategories] = useState([]); // Pour stocker les catégories

  useEffect(() => {
    if (!token) {
      alert("Vous devez être connecté pour accéder à votre compte.");
      navigate("/login"); 
      return;
    }

    fetch(`http://localhost:8000/user/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
          country: data.country || '',
          category: data.category || ''  // Assurez-vous de récupérer la catégorie si elle existe
        });
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert("Erreur lors de la récupération des informations utilisateur.");
      });

    // Récupérer les catégories (remplacez cette API par votre propre source)
    fetch('http://localhost:8000/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
        alert("Erreur lors de la récupération des catégories.");
      });
  }, [id, token, navigate]);

  const handleUpdate = () => {
    fetch(`http://localhost:8000/user/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        zipcode: parseInt(form.zipcode),
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la mise à jour');
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

        {/* Dropdown des catégories */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Catégorie :</strong></label><br />
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            style={{ width: '300px' }}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="button" onClick={handleUpdate}>
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}

export default Moncompte;

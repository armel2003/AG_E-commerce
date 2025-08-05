import React, {useState} from 'react';
import '../style/CreateArticle.css';

function CreateCategory() {
    const [formData, setFormData] = useState({
        name: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({type: '', text: ''});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({type: '', text: ''});

// Données de la catégorie à envoyer
        const categoryData = {
            name: formData.name,
        };

        try {
            const response = await fetch('http://localhost:8000/category/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage({type: 'success', text: 'Catégorie créée avec succès !'});
                setFormData({name: ''}); // Réinitialiser après succès
            } else {
                setMessage({type: 'error', text: result.error || 'Erreur lors de la création de la catégorie.'});
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="page-header">
                <h1 className="page-title">Créer une catégorie</h1>
                <p className="page-subtitle">Ajoutez une nouvelle catégorie pour vos produits</p>
            </div>

            {/* Affichage des messages d'alerte */}
            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-card">
                <form onSubmit={handleSubmit}>
                    <h3 style={{color: 'var(--neon-purple)', marginBottom: '1.5rem'}}>Informations de la catégorie</h3>

                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Nom de la catégorie *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            placeholder="Ex: Jeux vidéo"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Boutons d'action */}
                    <div className="btn-group">
                        <button
                            type="submit"
                            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            Ajouter la catégorie
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setFormData({name: ''}); // Réinitialiser le formulaire
                                setMessage({type: '', text: ''});
                            }}
                        >
                            🗑️ Réinitialiser
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCategory;

import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../style/EditArticle.css';

function EditCategory() {
    const {id: categoryId} = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({name: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            if (!categoryId) {
                setMessage('Aucun ID de catégorie trouvé.');
                return;
            }

            setIsLoading(true);
            setMessage('');

            try {
                const response = await fetch(`http://localhost:8000/category/${categoryId}`, {
                    headers: {'Accept': 'application/json'},
                });
                const data = await response.json();
                if (data.id) {
                    setFormData({name: data.name || ''});
                }
            } catch (err) {
                setMessage('Erreur lors du chargement de la catégorie.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId]);

    const handleChange = (e) => {
        const {value} = e.target;
        setFormData({name: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://localhost:8000/category/${categoryId}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: formData.name}),
            });

            if (!response.ok) {
                setMessage(`Erreur HTTP ${response.status}`);
                return;
            }

            setMessage('Catégorie mise à jour avec succès ');
            setTimeout(() => navigate('/admin/dashboard'), 1500);
        } catch (err) {
            setMessage('Erreur lors de la mise à jour.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => navigate('/admin/dashboard');

    return (
        <div className="admin-container">
            <div className="edit-article-header">
                <h1 className="edit-article-title">Modifier une catégorie</h1>
                <p className="edit-article-subtitle">Modifiez le nom de votre catégorie</p>
            </div>

            {message && (
                <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <div className="edit-article-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nom de la catégorie *</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="btn-group">
                        <button
                            type="submit"
                            className={`btn btn-update ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? '⏳ Mise à jour...' : 'Mettre à jour'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCategory;

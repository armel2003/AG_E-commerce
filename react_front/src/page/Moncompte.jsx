import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../style/Moncompte.css';

function Moncompte() {
    const {id} = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        adress: '',
        zipcode: '',
        city: '',
        country: '',
    });


    const validateForm = () => {
        const errors = [];

        if (!form.email || !form.email.includes('@')) {
            errors.push('Email invalide');
        }
        if (!form.firstName || form.firstName.trim().length < 2) {
            errors.push('Le prénom doit contenir au moins 2 caractères');
        }
        if (!form.lastName || form.lastName.trim().length < 2) {
            errors.push('Le nom doit contenir au moins 2 caractères');
        }
        if (form.zipcode && (isNaN(form.zipcode) || form.zipcode.length < 4)) {
            errors.push('Code postal invalide');
        }

        return errors;
    };


    const handleLogout = () => {
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            navigate('/');
        }
    };


    useEffect(() => {
        if (!token) {
            setError("Vous devez être connecté pour accéder à votre compte.");
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(`http://localhost:8000/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Session expirée. Veuillez vous reconnecter.');
                    } else if (response.status === 403) {
                        throw new Error('Accès non autorisé.');
                    } else if (response.status === 404) {
                        throw new Error('Utilisateur non trouvé.');
                    } else {
                        throw new Error('Erreur lors du chargement des données.');
                    }
                }

                const userData = await response.json();
                setUser(userData);
                setForm({
                    email: userData.email || '',
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    adress: userData.adress || '',
                    zipcode: userData.zipcode ? userData.zipcode.toString() : '',
                    city: userData.city || '',
                    country: userData.country || '',
                });
            } catch (error) {
                console.error('Erreur:', error);
                setError(error.message);
                if (error.message.includes('Session expirée')) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, token, navigate]);


    const handleUpdate = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return;
        }

        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`http://localhost:8000/user/update/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    zipcode: form.zipcode ? parseInt(form.zipcode) : null,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                } else if (response.status === 403) {
                    throw new Error('Vous n\'avez pas les droits pour modifier ce compte.');
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erreur lors de la mise à jour');
                }
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setSuccessMessage('Informations mises à jour avec succès !');


            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error) {
            console.error('Erreur:', error);
            setError(error.message);

            if (error.message.includes('Session expirée')) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setSaving(false);
        }
    };


    const handleInputChange = (name, value) => {
        setForm(prev => ({...prev, [name]: value}));

        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };


    if (loading) {
        return (
            <div className='account-page'>
                <div className='account-container'>
                    <div className='loading-container'>
                        <div className='loading-spinner'></div>
                        <h2 className='loading-text'>Chargement...</h2>
                        <p className='loading-subtitle'>Récupération de vos informations...</p>
                    </div>
                </div>
            </div>
        );
    }


    if (!user && !loading) {
        return (
            <div className='account-page'>
                <div className='account-container'>
                    <div className='loading-container'>
                        <h2 className='loading-text'>⚠️ Erreur</h2>
                        <p className='loading-subtitle'>{error || 'Impossible de charger les informations utilisateur.'}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className='form-btn primary'
                            style={{marginTop: '2rem'}}
                        >
                            🔑 Retour à la connexion
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");

    return (
        <div className='account-page'>
            <div className='account-container'>
                <div className='account-header'>
                    <h1 className='account-title'>🎮 Mon Compte</h1>
                    <p className='account-subtitle'>Gérez vos informations personnelles</p>
                </div>
                <div className='account-actions'>
                    <button
                        onClick={() => navigate('/suivi-commandes')}
                        className='action-btn orders'
                    >
                        📋 Mes Commandes
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => navigate('/admin')}
                            className='action-btn admin'
                        >
                            👑 Interface Admin
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className='action-btn logout'
                    >
                        Se déconnecter
                    </button>
                </div>
                {error && (
                    <div className='message error'>
                        ⚠️ {error}
                    </div>
                )}

                {successMessage && (
                    <div className='message success'>
                        ✅ {successMessage}
                    </div>
                )}
                <form onSubmit={handleUpdate} className='account-form'>
                    <div className='form-section'>
                        <h3 className='section-title'>
                            👤 Informations personnelles
                        </h3>

                        <div className='form-grid'>
                            <div className='form-field'>
                                <label className='form-label'>
                                    Prénom <span className='required'>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={e => handleInputChange('firstName', e.target.value)}
                                    className='form-input'
                                    placeholder="Votre prénom"
                                    required
                                />
                            </div>
                            <div className='form-field'>
                                <label className='form-label'>
                                    Nom <span className='required'>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={e => handleInputChange('lastName', e.target.value)}
                                    className='form-input'
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                        </div>
                        <div className='form-grid single'>
                            <div className='form-field'>
                                <label className='form-label'>
                                    📧 Email <span className='required'>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    className='form-input'
                                    placeholder="votre.email@exemple.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className='form-section'>
                        <h3 className='section-title'>
                            Adresse
                        </h3>
                        <div className='form-grid single'>
                            <div className='form-field'>
                                <label className='form-label'>
                                    Adresse complète
                                </label>
                                <input
                                    type="text"
                                    value={form.adress}
                                    onChange={e => handleInputChange('adress', e.target.value)}
                                    className='form-input'
                                    placeholder="123 rue de la Paix"
                                />
                            </div>
                        </div>
                        <div className='form-grid'>
                            <div className='form-field'>
                                <label className='form-label'>
                                    Code postal
                                </label>
                                <input
                                    type="text"
                                    value={form.zipcode}
                                    onChange={e => handleInputChange('zipcode', e.target.value)}
                                    className='form-input'
                                    placeholder="75001"
                                />
                            </div>
                            <div className='form-field'>
                                <label className='form-label'>
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    value={form.city}
                                    onChange={e => handleInputChange('city', e.target.value)}
                                    className='form-input'
                                    placeholder="Paris"
                                />
                            </div>
                        </div>
                        <div className='form-grid single'>
                            <div className='form-field'>
                                <label className='form-label'>
                                    Pays
                                </label>
                                <input
                                    type="text"
                                    value={form.country}
                                    onChange={e => handleInputChange('country', e.target.value)}
                                    className='form-input'
                                    placeholder="France"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='form-buttons'>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className='form-btn secondary'
                        >
                            ← Retour
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className='form-btn primary'
                        >
                            {saving ? (
                                <>
                                    <div className='spinner'></div>
                                    Enregistrement...
                                </>
                            ) : (
                                <> Enregistrer</>
                            )}
                        </button>
                    </div>
                </form>
                <p className='required-note'>
                    * Champs obligatoires
                </p>
            </div>
        </div>
    );
}

export default Moncompte;
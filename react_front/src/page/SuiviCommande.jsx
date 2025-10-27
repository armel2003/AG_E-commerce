import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/SuiviCommande.css';

function SuiviCommande() {
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("userId");

    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtreStatut, setFiltreStatut] = useState('tous');

    // Mapping des statuts avec leurs couleurs et icônes
    const statutsMap = {
        'en_attente': {
            label: 'En attente',
            color: '#f59e0b',
            icon: '⏳',
            description: 'Commande en cours de traitement'
        },
        'confirmee': {
            label: 'Confirmée',
            color: '#3b82f6',
            icon: '✅',
            description: 'Commande confirmée et en préparation'
        },
        'en_preparation': {
            label: 'En préparation',
            color: '#8b5cf6',
            icon: '📦',
            description: 'Commande en cours de préparation'
        },
        'expediee': {
            label: 'Expédiée',
            color: '#06b6d4',
            icon: '🚚',
            description: 'Commande expédiée'
        },
        'livree': {
            label: 'Livrée',
            color: '#10b981',
            icon: '🎯',
            description: 'Commande livrée avec succès'
        },
        'annulee': {
            label: 'Annulée',
            color: '#ef4444',
            icon: '❌',
            description: 'Commande annulée'
        }
    };

    useEffect(() => {
        if (!token || !userId) {
            setError("Vous devez être connecté pour accéder à vos commandes.");
            navigate("/login");
            return;
        }

        fetchCommandes();
    }, [token, userId, navigate]);

    const fetchCommandes = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`http://localhost:8000/user/${userId}/commandes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                } else if (response.status === 404) {
                    throw new Error('Aucune commande trouvée.');
                } else {
                    throw new Error('Erreur lors du chargement des commandes.');
                }
            }

            const commandesData = await response.json();
            setCommandes(commandesData);
        } catch (error) {
            console.error('Erreur:', error);
            setError(error.message);
            
            if (error.message.includes('Session expirée')) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const commandesFiltrees = filtreStatut === 'tous' 
        ? commandes 
        : commandes.filter(commande => commande.statut === filtreStatut);

    if (loading) {
        return (
            <div className='suivi-page'>
                <div className='suivi-container'>
                    <div className='loading-container'>
                        <div className='loading-spinner'></div>
                        <h2 className='loading-text'>Chargement...</h2>
                        <p className='loading-subtitle'>Récupération de vos commandes...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='suivi-page'>
            <div className='suivi-container'>
                {/* Header */}
                <div className='suivi-header'>
                    <button 
                        onClick={() => navigate(-1)}
                        className='back-btn'
                    >
                        ← Retour
                    </button>
                    <h1 className='suivi-title'>📋 Suivi de mes commandes</h1>
                    <p className='suivi-subtitle'>Suivez l'état de vos commandes en temps réel</p>
                </div>

                {error && (
                    <div className='message error'>
                        ⚠️ {error}
                    </div>
                )}

                {/* Filtres */}
                <div className='filtres-section'>
                    <h3 className='filtres-title'>Filtrer par statut :</h3>
                    <div className='filtres-buttons'>
                        <button 
                            className={`filtre-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
                            onClick={() => setFiltreStatut('tous')}
                        >
                            🔍 Toutes ({commandes.length})
                        </button>
                        {Object.entries(statutsMap).map(([statut, info]) => {
                            const count = commandes.filter(cmd => cmd.statut === statut).length;
                            if (count === 0) return null;
                            
                            return (
                                <button 
                                    key={statut}
                                    className={`filtre-btn ${filtreStatut === statut ? 'active' : ''}`}
                                    onClick={() => setFiltreStatut(statut)}
                                    style={{ '--btn-color': info.color }}
                                >
                                    {info.icon} {info.label} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Liste des commandes */}
                <div className='commandes-section'>
                    {commandesFiltrees.length === 0 ? (
                        <div className='no-commandes'>
                            <div className='no-commandes-icon'>📭</div>
                            <h3>Aucune commande trouvée</h3>
                            <p>
                                {filtreStatut === 'tous' 
                                    ? "Vous n'avez pas encore passé de commande."
                                    : `Aucune commande avec le statut "${statutsMap[filtreStatut]?.label}".`
                                }
                            </p>
                            <button 
                                onClick={() => navigate('/boutique')}
                                className='shop-btn'
                            >
                                🛍️ Découvrir nos produits
                            </button>
                        </div>
                    ) : (
                        <div className='commandes-grid'>
                            {commandesFiltrees.map((commande) => {
                                const statutInfo = statutsMap[commande.statut] || {
                                    label: commande.statut,
                                    color: '#6b7280',
                                    icon: '❓',
                                    description: 'Statut inconnu'
                                };

                                return (
                                    <div key={commande.id} className='commande-card'>
                                        <div className='commande-header'>
                                            <div className='commande-numero'>
                                                <span className='numero-label'>Commande #</span>
                                                <span className='numero-value'>{commande.id}</span>
                                            </div>
                                            <div 
                                                className='commande-statut'
                                                style={{ '--statut-color': statutInfo.color }}
                                            >
                                                <span className='statut-icon'>{statutInfo.icon}</span>
                                                <span className='statut-label'>{statutInfo.label}</span>
                                            </div>
                                        </div>

                                        <div className='commande-details'>
                                            <div className='detail-row'>
                                                <span className='detail-label'>📅 Date de commande :</span>
                                                <span className='detail-value'>
                                                    {formatDate(commande.dateCommande)}
                                                </span>
                                            </div>

                                            <div className='detail-row'>
                                                <span className='detail-label'>💰 Montant total :</span>
                                                <span className='detail-value price'>
                                                    {formatPrice(commande.montantTotal)}
                                                </span>
                                            </div>

                                            <div className='detail-row'>
                                                <span className='detail-label'>📦 Nombre d'articles :</span>
                                                <span className='detail-value'>
                                                    {commande.articles?.length || 0} article(s)
                                                </span>
                                            </div>

                                            {commande.adresseLivraison && (
                                                <div className='detail-row'>
                                                    <span className='detail-label'>🏠 Adresse de livraison :</span>
                                                    <span className='detail-value'>
                                                        {commande.adresseLivraison}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className='statut-description'>
                                            <p>{statutInfo.description}</p>
                                        </div>

                                        {/* Progression du statut */}
                                        <div className='progress-section'>
                                            <div className='progress-bar'>
                                                <div 
                                                    className='progress-fill'
                                                    style={{
                                                        width: getProgressWidth(commande.statut),
                                                        backgroundColor: statutInfo.color
                                                    }}
                                                ></div>
                                            </div>
                                            <div className='progress-labels'>
                                                <span className={commande.statut === 'en_attente' ? 'active' : ''}>
                                                    En attente
                                                </span>
                                                <span className={['confirmee', 'en_preparation', 'expediee', 'livree'].includes(commande.statut) ? 'active' : ''}>
                                                    Confirmée
                                                </span>
                                                <span className={['en_preparation', 'expediee', 'livree'].includes(commande.statut) ? 'active' : ''}>
                                                    Préparation
                                                </span>
                                                <span className={['expediee', 'livree'].includes(commande.statut) ? 'active' : ''}>
                                                    Expédiée
                                                </span>
                                                <span className={commande.statut === 'livree' ? 'active' : ''}>
                                                    Livrée
                                                </span>
                                            </div>
                                        </div>

                                        {/* Articles de la commande */}
                                        {commande.articles && commande.articles.length > 0 && (
                                            <div className='articles-section'>
                                                <h4 className='articles-title'>Articles commandés :</h4>
                                                <div className='articles-list'>
                                                    {commande.articles.slice(0, 3).map((article, index) => (
                                                        <div key={index} className='article-item'>
                                                            <span className='article-nom'>{article.nom}</span>
                                                            <span className='article-quantite'>x{article.quantite}</span>
                                                            <span className='article-prix'>
                                                                {formatPrice(article.prix)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {commande.articles.length > 3 && (
                                                        <div className='articles-more'>
                                                            +{commande.articles.length - 3} autre(s) article(s)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Fonction pour calculer la largeur de la barre de progression
function getProgressWidth(statut) {
    const progressMap = {
        'en_attente': '20%',
        'confirmee': '40%',
        'en_preparation': '60%',
        'expediee': '80%',
        'livree': '100%',
        'annulee': '0%'
    };
    return progressMap[statut] || '0%';
}

export default SuiviCommande;

import React, {useState} from 'react';
import RecentProducts from '../components/RecentProductAdmin';
import {useNavigate} from 'react-router-dom';
import PromoList from '../components/all_promo';
import PromoManager from './CreatePromo';

function Promo({onEditArticle}) {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([
    ]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [message, setMessage] = useState({type: '', text: ''});

    // const handleEditArticle = (articleId) => {
    //     if (onEditArticle) {
    //         onEditArticle(articleId);
    //     } else {
    //         console.log('Modifier l\'article:', articleId);
    //         navigate(`/edit-article/${articleId}`);
    //     }
    // };

    const confirmDeleteArticle = () => {
        if (articleToDelete) {
            setArticles(prevArticles => prevArticles.filter(article => article.id !== articleToDelete.id));
            setMessage({type: 'success', text: `Article "${articleToDelete.name}" supprimé avec succès ! 🗑️`});
            setShowDeleteModal(false);
            setArticleToDelete(null);

            setTimeout(() => {
                setMessage({type: '', text: ''});
            }, 3000);
        }
    };

    const cancelDeleteArticle = () => {
        setShowDeleteModal(false);
        setArticleToDelete(null);
    };

    const DeleteConfirmModal = () => {
        if (!showDeleteModal || !articleToDelete) return null;

        return (
            <div className="modal-overlay" onClick={cancelDeleteArticle}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3 className="modal-title">
                        🗑️ Confirmer la suppression
                    </h3>
                    <p className="modal-message">
                        Êtes-vous sûr de vouloir supprimer l'article <strong>"{articleToDelete.name}"</strong> ?<br/>
                        Cette action est irréversible.
                    </p>
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={cancelDeleteArticle}>
                            Annuler
                        </button>
                        <button className="btn btn-delete" onClick={confirmDeleteArticle}>
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="admin-container">
            <DeleteConfirmModal/>
            <div className="page-header">
                <h1 className="page-title">Tableau de bord</h1>
                <p className="page-subtitle">Vue d'ensemble de votre plateforme e-commerce gaming</p>
            </div>
            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}
            <div className="admin-card" style={{marginBottom: '2rem'}}>
                <h3 style={{color: 'var(--neon-purple)', marginBottom: '1rem'}}>🚀 Actions rapides</h3>
                <div className="btn-group">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/admin/create-article')}
                    >
                        ➕ Créer un nouvel article
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/user-management')}
                    >
                        👥 Gérer les utilisateurs
                    </button>
                    <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/promo')}
                    >
                        🎁Gérer les Promos
                    </button>
                    <button className="btn btn-secondary">
                        ⚙️ Paramètres
                    </button>
                </div>
            </div>
            <div className="">
                <div className="admin-card"
                >
                    <div className=""
                    style={{width:'100%',height:'100%'}}>
                        <PromoManager/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Promo;

import React, {useState} from 'react';
import '../style/AdminDashboard.css';
import RecentProducts from '../components/RecentProductAdmin';
import Allcategory from '../components/all_category';
import {useNavigate} from 'react-router-dom';
import RecentUsers from '../components/all_user';

function AdminDashboard({onEditArticle}) {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([
        {id: 1, name: 'Apex Legends - 1000 Coins', price: '€9.99', status: 'Actif', sales: 156},
        {id: 2, name: 'Valorant - VP Bundle', price: '€24.99', status: 'Actif', sales: 89},
        {id: 3, name: 'CS2 - Operation Pass', price: '€14.99', status: 'Épuisé', sales: 234},
        {id: 4, name: 'LoL - RP Premium Pack', price: '€49.99', status: 'Actif', sales: 67}
    ]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [message, setMessage] = useState({type: '', text: ''});

    const stats = {
        totalUsers: 1247,
        totalArticles: articles.length,
        pendingOrders: 23,
        revenue: '€15,420'
    };

    const recentUsers = [
        {id: 1, name: 'Alexandre Martin', email: 'alex.martin@email.com', role: 'User', joinDate: '2025-01-20'},
        {id: 2, name: 'Sophie Dubois', email: 'sophie.d@email.com', role: 'User', joinDate: '2025-01-19'},
        {id: 3, name: 'Lucas Bernard', email: 'l.bernard@email.com', role: 'User', joinDate: '2025-01-18'},
        {id: 4, name: 'Emma Rousseau', email: 'emma.r@email.com', role: 'User', joinDate: '2025-01-17'}
    ];

    const handleEditArticle = (articleId) => {
        if (onEditArticle) {
            onEditArticle(articleId);
        } else {
            console.log('Modifier l\'article:', articleId);
            navigate(`/edit-article/${articleId}`);
        }
    };

    const handleDeleteArticle = (articleId) => {
        const article = articles.find(a => a.id === articleId);
        setArticleToDelete(article);
        setShowDeleteModal(true);
    };

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

    const getproductsexport = () => {
        fetch("http://localhost:8000/admin/export" , {
            headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    'Accept': 'application/json',
                }
        })
    .then((res) => res.blob())
    .then(blob => {
        let file = window.URL.createObjectURL(blob);
        window.location.assign(file);
    })
    .catch((err) => console.error("Erreur produits :", err));
    }

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

            {/* Actions rapides */}
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


            <div className="grid grid-2">
                <div className="admin-card">
                    <div className="">
                        <RecentProducts/>
                    </div>
                    <button
                        className="btn btn-secondary btn-small"
                        style={{marginTop: '1rem', width: '100%'}}
                        onClick={() => navigate('/create-article')}
                    >
                        Voir tous les articles
                    </button>
                   <button
                        className="btn btn-secondary btn-small"
                        style={{marginTop: '1rem', width: '100%'}}
                        onClick={() => getproductsexport()}
                    >
                        telecharger les produits
                    </button>
                </div>


                <div className="admin-card">
                    <div className="">
                        <RecentUsers/>
                    </div>
                    <button
                        className="btn btn-secondary btn-small"
                        style={{marginTop: '1rem', width: '100%'}}
                        onClick={() => navigate('/user-management')}
                    >
                        Gérer les utilisateurs
                    </button>
                </div>

            </div>
            <div className="admin-card">
                <h3 style={{color: 'var(--neon-purple)', marginBottom: '1rem'}}>📦 Tous les category</h3>
                <Allcategory/>
            </div>

        </div>
    );
}

export default AdminDashboard;

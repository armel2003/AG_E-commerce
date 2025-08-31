import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const RecentCategory = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/category')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des catégories :', error);
                setLoading(false);
            });
    }, []);

    const handleEditCategory = (categoryId) => {
        console.log(`Redirection vers /admin/${categoryId}/category/edit`);
        navigate(`/admin/${categoryId}/category/edit`);
    };

    const handleCreateCategory = () => {
        console.log(`Redirection vers /admin/create-category`);
        navigate(`/admin/create-category`);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/category/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });

            let data = null;
            if (response.status !== 204) {
                data = await response.json();
            }

            if (response.ok) {
                alert(data?.message || "Catégorie supprimée avec succès !");
                window.location.reload();
            } else {
                alert("Erreur lors de la suppression de la catégorie.");
            }
        } catch (error) {
            alert("Une erreur réseau s'est produite.");
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="">
            <div className="">
                <h3 style={{color: 'var(--neon-purple)', marginBottom: '1rem'}}>🎮 Catégories</h3>
                <button
                    className="btn-edit"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCreateCategory();
                    }}
                    title="Create"
                >
                    Create
                </button>
                <div className="table-container">
                    {categories.map(categ => (
                        <div
                            key={categ.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/product/${categ.id}`)}
                        >
                            <div style={{flex: 1}}>
                                <div style={{fontWeight: '500', marginBottom: '0.25rem'}}>
                                    {categ.name}
                                </div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span className={`badge ${categ.status === 'Actif' ? 'badge-user' : 'badge-pending'}`}>
                {categ.status}
            </span>
                                <div className="article-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditCategory(categ.id);
                                        }}
                                        title="Modifier la catégorie"
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCategory(categ.id);
                                        }}
                                        title="Supprimer la catégorie"
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentCategory;

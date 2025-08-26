import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentProducts = ({ count = 4 }) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [promos, setPromos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, promosRes] = await Promise.all([
                    fetch('http://localhost:8000/product'),
                    fetch('http://localhost:8000/promos')
                ]);

                const productsData = await productsRes.json();
                const promosData = await promosRes.json();

                const sorted = productsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                // Appliquer les promotions
                const enrichedProducts = sorted.map(prod => {
                    const promo = promosData.find(p => p.product === prod.id);
                    if (promo) {
                        const originalPrice = parseFloat(prod.price);
                        const discounted = (originalPrice * (1 - promo.value)).toFixed(2);
                        return {
                            ...prod,
                            isPromo: true,
                            discountedPrice: discounted,
                            promoValue: promo.value
                        };
                    }
                    return prod;
                });

                setProducts(enrichedProducts.slice(0, count));
                setPromos(promosData);
            } catch (error) {
                console.error('Erreur lors du chargement des produits ou promotions :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [count]);

    const handleEditProduct = (productId) => {
        console.log(`Redirection vers /edit_produit_admin/${productId}`);
        navigate(`${productId}/edit`);
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/product/admin/${productId}/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    'Accept': 'application/json',
                },
            });

            let data = null;
            if (response.status !== 204) {
                data = await response.json();
            }

            if (response.ok) {
                alert(data?.message || "Produit supprimé avec succès !");
                window.location.reload();
            } else {
                alert("Erreur lors de la suppression.");
            }
        } catch (error) {
            alert("Une erreur réseau est survenue.");
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="">
            <div className="">
                <h3 style={{ color: 'var(--neon-purple)', marginBottom: '1rem' }}>🎮 Produits</h3>
                <div className="table-container">
                    {products.map(prod => (
                        <div
                            key={prod.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/product/${prod.id}`)}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                    {prod.name}{" "}
                                    {prod.isPromo && <span title="En promotion">🎁</span>}
                                    {prod.isNew && <span title="Nouveau produit" style={{ marginLeft: '5px' }}>🆕</span>}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {prod.isPromo ? (
                                        <>
                                            <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                                                {prod.price} €
                                            </span>{" "}
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                                {prod.discountedPrice} €
                                            </span>
                                        </>
                                    ) : (
                                        <>{prod.price} €</>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className={`badge ${prod.status === 'Actif' ? 'badge-user' : 'badge-pending'}`}>
                                    {prod.stock > 0 ? prod.stock : 'Rupture de stock'}
                                </span>
                                <div className="article-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditProduct(prod.id);
                                        }}
                                        title="Modifier le produit"
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProduct(prod.id);
                                        }}
                                        title="Supprimer le produit"
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

export default RecentProducts;

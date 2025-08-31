import React, { useEffect, useState } from 'react';
import '../style/homedacceil.css';

const PromoList = () => {
    const [loading, setLoading] = useState(true);
    const [promos, setPromos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/promos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de chargement des promos');
                }
                return response.json();
            })
            .then(data => {
                setPromos(data);
                console.log(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur :', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Chargement des promotions...</p>;

    return (
        <div className="promo-grid">
            {promos.map(promo => (
                <div key={promo.id} className="promo-card" >
                    <h3 style={{color: 'var(--neon-purple)', marginBottom: '1rem'}}> 🎁 All promos</h3>
                    <p><strong>Produit :</strong> {promo.product_name || 'Produit inconnu'}</p>
                    <p><strong>Réduction :</strong> {promo.value ? `${(promo.value * 100).toFixed(0)}%` : 'Aucune réduction'}</p>
                </div>
            ))}
        </div>
    );
};

export default PromoList;

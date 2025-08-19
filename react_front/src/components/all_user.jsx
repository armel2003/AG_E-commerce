import React, {useEffect, useState} from 'react';

const RecentUsers = ({count = 4}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/user')
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUsers(sorted.slice(0, count));
                setLoading(false);
            })
            .catch((error) => {
                console.error("❌ Erreur lors du chargement des utilisateurs :", error);
                setLoading(false);
            });
    }, [count]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="">
            <h3 style={{color: 'var(--neon-purple)', marginBottom: '1rem'}}>👥 Nouveaux utilisateurs</h3>
            <div className="table-container">
                {users.map(user => (
                    <div
                        key={user.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid rgba(124, 58, 237, 0.1)'
                        }}
                    >
                        <div>
                            <div style={{fontWeight: '500', marginBottom: '0.25rem'}}>
                                {user.firstName || 'Nom inconnu'} {user.lastName || 'Nom inconnu'}
                            </div>
                            <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                                {user.email || 'Email non disponible'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentUsers;

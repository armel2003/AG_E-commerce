import React, {useState} from 'react';
import '../style/UserManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'edit', 'delete', 'suspend'

    // Filtrage des utilisateurs
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleUserAction = (user, action) => {
        setSelectedUser(user);
        setModalType(action);
        setShowModal(true);
    };

    const executeUserAction = () => {
        if (!selectedUser) return;

        switch (modalType) {
            case 'suspend':
                setUsers(users.map(user =>
                    user.id === selectedUser.id
                        ? {...user, status: user.status === 'Actif' ? 'Suspendu' : 'Actif'}
                        : user
                ));
                break;
            case 'delete':
                setUsers(users.filter(user => user.id !== selectedUser.id));
                break;
            case 'promote':
                setUsers(users.map(user =>
                    user.id === selectedUser.id
                        ? {...user, role: user.role === 'User' ? 'Admin' : 'User'}
                        : user
                ));
                break;
            default:
                break;
        }

        setShowModal(false);
        setSelectedUser(null);
        setModalType('');
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Actif':
                return 'user-badge-active';
            case 'Suspendu':
                return 'user-badge-suspended';
            default:
                return 'user-badge-active';
        }
    };

    const getRoleBadgeClass = (role) => {
        return role === 'Admin' ? 'user-badge-admin' : 'user-badge-user';
    };

    return (
        <div className="user-management-container">
            {/* En-tête de page */}
            <div className="user-management-header">
                <h1 className="user-management-title">Gestion des utilisateurs</h1>
                <p className="user-management-subtitle">Administrez les comptes utilisateurs de votre plateforme</p>
            </div>

            {/* Statistiques rapides */}
            <div className="user-stats-grid">
                <div className="user-stat-card">
                    <span className="user-stat-icon">👥</span>
                    <h3 className="user-stat-title">Total utilisateurs</h3>
                    <div className="user-stat-number">{users.length}</div>
                </div>
                <div className="user-stat-card">
                    <span className="user-stat-icon">✅</span>
                    <h3 className="user-stat-title">Utilisateurs actifs</h3>
                    <div className="user-stat-number">
                        {users.filter(u => u.status === 'Actif').length}
                    </div>
                </div>
                <div className="user-stat-card">
                    <span className="user-stat-icon">👑</span>
                    <h3 className="user-stat-title">Administrateurs</h3>
                    <div className="user-stat-number">
                        {users.filter(u => u.role === 'Admin').length}
                    </div>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="user-filters-card">
                <h3 className="user-filters-title">🔍 Filtres et recherche</h3>
                <div className="user-filters-grid">
                    <div className="user-filter-group">
                        <label className="user-filter-label" htmlFor="search">
                            Rechercher un utilisateur
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="user-filter-input"
                            placeholder="Nom ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="user-filter-group">
                        <label className="user-filter-label" htmlFor="roleFilter">
                            Filtrer par rôle
                        </label>
                        <select
                            id="roleFilter"
                            className="user-filter-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">Tous les rôles</option>
                            <option value="User">Utilisateur</option>
                            <option value="Admin">Administrateur</option>
                        </select>
                    </div>
                    <div className="user-filter-group">
                        <label className="user-filter-label" htmlFor="statusFilter">
                            Filtrer par statut
                        </label>
                        <select
                            id="statusFilter"
                            className="user-filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="Actif">Actif</option>
                            <option value="Suspendu">Suspendu</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="users-table-card">
                <div className="users-table-title">
                    <span>👥 Liste des utilisateurs</span>
                    <span className="users-count-badge">({filteredUsers.length})</span>
                </div>

                <div className="users-table-wrapper">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Inscription</th>
                            <th>Dernière connexion</th>
                            <th>Commandes</th>
                            <th>Total dépensé</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                </td>
                                <td>
                    <span className={`user-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                                </td>
                                <td>
                    <span className={`user-badge ${getStatusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                                </td>
                                <td>
                                    {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                                </td>
                                <td>
                                    {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                                </td>
                                <td>
                                    <strong>{user.orders}</strong>
                                </td>
                                <td>
                                    <strong style={{color: 'var(--user-mgmt-accent)'}}>
                                        {user.totalSpent.toFixed(2)}€
                                    </strong>
                                </td>
                                <td>
                                    <div className="user-actions">
                                        <button
                                            className="user-action-btn user-action-btn-edit"
                                            onClick={() => handleUserAction(user, 'edit')}
                                            title="Modifier"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={`user-action-btn ${user.status === 'Actif' ? 'user-action-btn-suspend' : 'user-action-btn-activate'}`}
                                            onClick={() => handleUserAction(user, 'suspend')}
                                            title={user.status === 'Actif' ? 'Suspendre' : 'Réactiver'}
                                        >
                                            {user.status === 'Actif' ? '⏸️' : '▶️'}
                                        </button>
                                        <button
                                            className="user-action-btn user-action-btn-promote"
                                            onClick={() => handleUserAction(user, 'promote')}
                                            title={user.role === 'User' ? 'Promouvoir Admin' : 'Rétrograder User'}
                                        >
                                            {user.role === 'User' ? '⬆️' : '⬇️'}
                                        </button>
                                        <button
                                            className="user-action-btn user-action-btn-delete"
                                            onClick={() => handleUserAction(user, 'delete')}
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="users-empty-state">
                        <div className="users-empty-icon">🔍</div>
                        <div className="users-empty-title">Aucun utilisateur trouvé</div>
                        <div className="users-empty-message">
                            Aucun utilisateur ne correspond à vos critères de recherche.
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de confirmation */}
            {showModal && (
                <div className="user-modal-overlay">
                    <div className="user-modal">
                        <h3 className="user-modal-title">
                            Confirmer l'action
                        </h3>

                        <p className="user-modal-message">
                            {modalType === 'delete' &&
                                `Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${selectedUser?.name}" ?`
                            }
                            {modalType === 'suspend' &&
                                `Êtes-vous sûr de vouloir ${selectedUser?.status === 'Actif' ? 'suspendre' : 'réactiver'} l'utilisateur "${selectedUser?.name}" ?`
                            }
                            {modalType === 'promote' &&
                                `Êtes-vous sûr de vouloir ${selectedUser?.role === 'User' ? 'promouvoir' : 'rétrograder'} l'utilisateur "${selectedUser?.name}" ?`
                            }
                        </p>

                        <div className="user-modal-actions">
                            <button
                                className={`user-modal-btn user-modal-btn-confirm ${modalType === 'delete' ? 'danger' : ''}`}
                                onClick={executeUserAction}
                            >
                                Confirmer
                            </button>
                            <button
                                className="user-modal-btn user-modal-btn-cancel"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUser(null);
                                    setModalType('');
                                }}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;

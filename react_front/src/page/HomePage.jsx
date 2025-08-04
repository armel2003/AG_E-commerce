import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import '../style/homedacceil.css';
import Product from '../components/all_product';
import RecentProducts from '../components/RecentProducts';
import Cart from '../components/Cart';
import logo from "../asset/logo.png";
import { Link } from 'react-router-dom';


const categories = [
	{ name: "Clés de jeux", active: true },
	{ name: "Cartes", active: false },
	{ name: "Gamer Kits", active: false },
	{ name: "Offres Mystère", active: false },
];

const games = [
	{
		name: "Read Dead Redemption 2 - 9,99€",
		image:
			"https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png?w=440",
	},
	{
		name: "Starfield - 7,99€",
		image:
			"https://media.senscritique.com/media/000021075053/0/starfield.png",
	},
	{
		name: "Cyberpunk 2077 - 10,99€",
		image:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg5wIdpbVfu-xj7ZPrdoYoMNGNokeVfG8a9g&s",
	},
	{
		name: "The Witcher 3: Wild Hunt - 20,99€",
		image:
			"https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/qezXTVn1ExqBjVjR5Ipm97IK.png",
	},
];

export default function HomePage() {
	const navigate = useNavigate();
	const [showCartModal, setShowCartModal] = useState(false);
	const cart = useSelector((state) => state.cart);
	const user = localStorage.getItem('user');
	const role = localStorage.getItem("role");

	const handleCartClose = () => {
		setShowCartModal(false);
	};

	// Calculer le nombre total d'articles (avec quantités)
	const totalItems = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
	return (
		<div className="homepage-root">

			{/* Header */}
			<header className="homepage-header">
				<div className="flex items-center gap-2">
					<div className="logopentakeys">
						<img src={logo} alt="Logo PentaKeys" style={{ width: 90, height: 90 }} />
					</div>
					{user && (
						<>
							<div className="user-welcome" style={{ marginLeft: 20, fontWeight: 'bold' }}>
								Bonjour, {user} 🎮
							</div>
							<button
								className="account-btn"
								onClick={() => navigate(`/account/${localStorage.getItem('userId')}`)}
							>
								Mon compte
							</button>
							<button
								className="logout-btn"
								onClick={() => {
									localStorage.removeItem('user');
									localStorage.removeItem('token');
									navigate('/');
								}}
							>
								Déconnexion
							</button>
						</>
					)}
				</div>

				<nav className="homepage-nav">

					<Link to="/" className="nav-link">Acceuil</Link>
					<Link to="/boutique" className="nav-link">🛒 Boutique</Link>
					<a href="#" className="nav-link">🎮 Kits</a>
					<a href="#" className="nav-link">🎁 Clés Mystères</a>
				</nav>
				<div className="homepage-actions">
					<button onClick={() => navigate('/login')}>
						<img src="https://www.svgrepo.com/show/453660/account.svg" alt="Account Icon" width="20" height="20" />
						Connexion
					</button>
					<button onClick={() => setShowCartModal(true)} className="cart-header-button">
						🛒 Panier
						{totalItems > 0 && (
							<span className="cart-badge-header">{totalItems}</span>
						)}
					</button>
				</div>
			</header>

			{/* Banner */}
			<section className="homepage-banner">
				<p>🎮 Paie Moins, Joue Plus 🎮</p>
			</section>

			{/* Categories */}
			<div className="homepage-categories">
				{categories.map((cat) => (
					<a
						key={cat.name}
						href="#"
						className={cat.active ? "active" : ""}
					>
						{cat.name}
					</a>
				))}
			</div>

			{/* Games grid */}
			<h2>🔥 Jeux en vedette</h2>
			<div className="homepage-grid">
				{games.map((game) => (
					<div className="homepage-card" key={game.name}>
						<div
							className="homepage-card-img"
							style={{
								backgroundImage: `url('${game.image}')`,
							}}
						></div>
						<p>{game.name}</p>
					</div>
				))}
			</div>

			{/* Composant pour produits similaires */}
			<h2>🎯 Tous nos produits</h2>
			<Product />

			<h2>⚡ Nouvelles sorties</h2>
			<RecentProducts count={4} />

			<h2>🏆 Top ventes</h2>

			<h2>🤝 Nos plateformes Partenaires</h2>
			
			{/* Modal du panier */}
			{showCartModal &&
				createPortal(<Cart onClose={handleCartClose} />, document.body)}
		</div>
	);
}


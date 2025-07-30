import React from "react";
import { useNavigate } from "react-router-dom";
import '../style/homedacceil.css';
import Product from '../components/all_product';
import RecentProducts from '../components/RecentProducts';
import logo from "../asset/logo.png";



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
	const user = localStorage.getItem('user');
	const role = localStorage.getItem("role");
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
					<a href="#" className="nav-link">🏠 Accueil</a>
					<a href="#" className="nav-link">🛒 Boutique</a>
					<a href="#" className="nav-link">🎮 Kits</a>
					<a href="#" className="nav-link">🎁 Clés Mystères</a>
				</nav>
				<div className="homepage-actions">
					<button onClick={() => navigate('/login')}>
						<img src="https://www.svgrepo.com/show/453660/account.svg" alt="Account Icon" width="20" height="20" />
						Connexion
					</button>
					<button>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20px"
							height="20px"
							fill="currentColor"
							viewBox="0 0 256 256"
						>
							<path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z" />
						</svg>
						Panier
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
		</div>
	);
}

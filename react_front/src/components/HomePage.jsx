import React from "react";
import logo from "./assets/logo_pentakeys.png";




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
	return (
		<div className="homepage-root">
			<style>{`
        .homepage-root {
  background: #221112;
  color: #fff;
  min-height: 100vh;
}

        .homepage-header {
          border-bottom: 1px solid #472426;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #221112;
        }
        .homepage-header h2 {
          font-size: 1.25rem;
          font-weight: bold;
          letter-spacing: -0.015em;
        }
        .homepage-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }


        .homepage-nav a {
          color: #fff;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
        }
        .homepage-actions {
          display: flex;
          gap: 0.5rem;
        }
        .homepage-actions button {
          background: #9947eb;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          font-weight: bold;
          padding: 0.5rem 1.5rem;
          cursor: pointer;
          font-size: 1rem;
        }
        .homepage-banner {
          background: linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 25%), url('https://img.freepik.com/photos-premium/salon-jeu-joueur-video-personne-ne-moque-neeon-chill-chambre-jeu-confortable_916191-128316.jpg');
          background-size: cover;
          background-position: center;
          min-height: 220px;
          display: flex;
          align-items: flex-end;
          border-radius: 1rem;
          margin: 2rem 2rem 1rem 2rem;
        }
        .homepage-banner p {
         font-size: 2rem;
  font-weight: bold;
  padding: 1.5rem;
  margin: 0;
  color: #fff;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
        }
        .homepage-categories {
          display: flex;
          border-bottom: 1px solid #1a1221;
          gap: 2rem;
          padding: 1rem 2rem 0.5rem 2rem;
        }
        .homepage-categories a {
          color: #c89295;
          font-weight: bold;
          font-size: 1rem;
          padding: 1rem 0;
          border-bottom: 3px solid transparent;
          text-decoration: none;
        }
        .homepage-categories a.active {
          color: #fff;
          border-bottom: 3px solid #1a1221;
        }
        .homepage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(158px, 1fr));
          gap: 1rem;
          padding: 1.5rem 2rem;
        }
        .homepage-card {
          background: #2a181a;
          border-radius: 1rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .homepage-card-img {
          width: 70%;
          aspect-ratio: 1/1;
          background-size: cover;
          background-position: center;
          border-radius: 1rem;
        }
        .homepage-card p {
          margin: 0.5rem 0 1rem 0;
          font-size: 1rem;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .homepage-banner { margin: 1rem 0.5rem; }
          .homepage-categories, .homepage-grid { padding: 1rem 0.5rem; }
        }
      `}</style>

			{/* Header */}
			<header className="homepage-header">
			<div className="flex items-center gap-2">
        <div className="logopentakeys">
  <img src={logo} alt="Logo du site" style={{ width: 90, height: 90 }} />
        </div>
</div>

				<nav className="homepage-nav">
					<a href="#">Accueil</a>
					<a href="#">Boutique</a>
					<a href="#">Kits</a>
					<a href="#">Clés Mystères</a>
				</nav>
				<div className="homepage-actions">
          <button><img src="https://www.svgrepo.com/show/453660/account.svg" alt="Account Icon" width="20" height="20" color="white"/>
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
					</button>
				</div>
			</header>

			{/* Banner */}
			<section className="homepage-banner">
				<p>Paie Moins, Joue Plus</p>
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
		</div>
	);
}

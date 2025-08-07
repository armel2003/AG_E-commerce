import {useSelector, useDispatch} from "react-redux";
import {deleteFromCart, increaseQuantity, decreaseQuantity} from "../redux/cart";
import "../style/cartmodal.css"
import {useNavigate} from "react-router-dom";

// MODAL DU PANIER
export default function Cart({onClose, products = []}) {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fonction pour récupérer l'image du produit
    const getProductImage = (item) => {
        if (item.images && item.images.length > 0) {
            return item.images[0];
        }
        const prod = products.find(p => p.id === item.id);
        return prod?.images?.[0] || 'placeholder.jpg';
    };

    const handleCheckout = () => {
        navigate("/commande");
        onClose();
    };

const token = localStorage.getItem("userToken");

// Supprimer un article du panier côté backend + redux
const handleRemoveFromCart = async (productId) => {
    try {
        await fetch(`http://localhost:8000/cart/${productId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(deleteFromCart(productId));
    } catch (error) {
        console.error("Erreur suppression article :", error);
    }
};

const handleClearCart = async () => {
    try {
        await fetch(`http://localhost:8000/cart/empty`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Tu peux dispatch(setCartItems([])) ou recréer une action "clearCart"
        dispatch({ type: "CLEAR_CART" });
    } catch (error) {
        console.error("Erreur vidage panier :", error);
    }
};

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} className="cart-close-btn">
                    ✕
                </button>


                <h2 className="cart-title">🛒 Ton Panier</h2>

                {/* Contenu du panier */}
                {cart.items.length > 0 ? (
                    <>
                        <ul className="cart-items">
                            {cart.items.map((item) => (
                                <li key={item.id} className="cart-item">
                                    <img
                                        src={getProductImage(item)}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h4 className="cart-item-name">{item.name}</h4>
                                        <p className="cart-item-price">{item.price} € × {item.quantity}</p>
                                        <p className="cart-item-total">Total: {(item.price * item.quantity).toFixed(2)} €</p>
                                    </div>

                                    {/* Contrôles de quantité */}
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => dispatch(decreaseQuantity(item.id))}
                                            className="quantity-btn quantity-decrease"
                                        >
                                            -
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button
                                            onClick={() => dispatch(increaseQuantity(item.id))}
                                            className="quantity-btn quantity-increase"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* <button
                                        onClick={() => dispatch(deleteFromCart(item.id))}
                                        className="cart-remove-btn"
                                    >
                                        🗑️
                                            </button> */}
                                    <button
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="cart-remove-btn"
                                    >
                                    🗑️
                                    </button>

                                </li>
                            ))}
                        </ul>


                        <div className="cart-total">
                            <p className="cart-total-price">
                                Total : <strong>{cart.totalPrice.toFixed(2)} €</strong>
                            </p>
                            <button onClick={handleCheckout} className="cart-checkout-btn">
                                Valider la commande
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="cart-empty">
                        <p>🎮 Aucun jeu ajouté pour le moment...</p>
                        <p>Explore notre boutique pour découvrir nos offres !</p>
                    </div>
                )}
            </div>
        </div>
    );
}

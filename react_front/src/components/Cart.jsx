import { useSelector, useDispatch } from "react-redux";
import { deleteFromCart } from "../redux/cart";
import "../style/cartmodal.css"
import { useNavigate } from "react-router-dom";



//ICI LE CONTENU DU MODAL 
export default function Cart({ onClose }) {
const cart = useSelector((state) => state.cart);
const dispatch = useDispatch();
const navigate = useNavigate();



//console.log("🛒 Contenu du panier :", cart.items);

return (
<div
    onClick={onClose}
    className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center"
>
    <div
    onClick={(e) => e.stopPropagation()}
    className="cart-modal"
    >
    {/* Bouton de fermeture */}
    <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white bg-red-600 rounded px-2"
    >
        ✕
    </button>

    <h2 className="text-2xl mb-4">🛒 Ton panier</h2>

    {/* Contenu du panier */}
    <ul>
        {cart.items.length > 0 ? (
        cart.items.map((el) => (
            <li key={el.id} className="flex items-center justify-between mb-4">
            <img
                src={el.images?.[0]}
                alt={el.name}
                className="w-16 h-16 object-cover rounded"
            />
            <span className="mx-2">{el.name}</span>
            <span>{el.price} €</span>
            <button
                onClick={() => dispatch(deleteFromCart(el.id))}
                className="bg-slate-800 text-white px-2 py-1 rounded"
            >
                Retirer
            </button>
            </li>
        ))
        ) : (
        <li>Aucun jeu ajouté pour le moment...</li>
        )}
    </ul>

    {/* Total et bouton de commande */}
    <p className="mt-4 text-xl">
        Total : <strong>{cart.totalPrice.toFixed(2)} €</strong>
    </p>
    <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    onClick={() => navigate("/commande")}
    >
        Valider la commande
    </button>
    
    </div>
</div>
);
}

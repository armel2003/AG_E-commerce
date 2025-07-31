import { useState } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import Cart from "./Cart";
import "../style/cartmodal.css";

//Le bouton qui ouvre ton panier.
function FloatingCartButton() {
const [showModal, setShowModal] = useState(false);
const cart = useSelector((state) => state.cart);

const handleClose = () => {
setShowModal(false);
};

console.log("📦 Cart items :", cart.items);

return (
<>
    <button onClick={() => setShowModal(true)} className="floating-cart-button">
    🛒
    {cart.items.length > 0 && (
        <span className="cart-badge">{cart.items.length}</span>
    )}
    </button>

    {showModal &&
    createPortal(<Cart onClose={handleClose} />, document.body)}
</>
);
}

export default FloatingCartButton;

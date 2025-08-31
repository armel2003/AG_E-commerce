import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import Cart from "./Cart";
import "../style/cartmodal.css";




//Le bouton qui ouvre ton panier.
function FloatingCartButton() {
    const [showModal, setShowModal] = useState(false);
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleClose = () => {
        setShowModal(false);
    };


    const totalItems = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);

    console.log("📦 Cart items :", cart.items);

    return (
        <>
            <button onClick={() => setShowModal(true)} className="floating-cart-button">
                🛒 Panier
                {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                )}
            </button>

            {showModal &&
                createPortal(<Cart onClose={handleClose}/>, document.body)}
        </>
    );
}

export default FloatingCartButton;

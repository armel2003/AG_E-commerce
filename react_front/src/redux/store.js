import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart.jsx";

//recup le panier local
function Cartlocalstorage() {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? { cart: JSON.parse(storedCart) } : undefined;
}

// regard si il y un truc dans local et recup
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: Cartlocalstorage()
});

// enregist a chaque chang
store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("cart", JSON.stringify(state.cart));
});

export default store;

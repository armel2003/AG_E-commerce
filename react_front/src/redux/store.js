import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart.jsx";

const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});

export default store;

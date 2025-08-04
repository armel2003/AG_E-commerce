import { createSlice } from "@reduxjs/toolkit";

//FICHIER POUR STOCKER NOS PRODUCT
const initialState = {
    items: [],
    totalPrice: 0,
};

export const cartSlice = createSlice({
name: "cart",
initialState,
reducers: {
createCartItem: (state, action) => {
    const product = action.payload;
    const exists = state.items.find(item => item.id === product.id);
    if (!exists) {
    // Ajouter le produit avec une quantité de 1
    state.items.push({ ...product, quantity: 1 });
    state.totalPrice += Number(product.price); 
    } else {
    // Si le produit existe déjà, augmenter la quantité
    exists.quantity += 1;
    state.totalPrice += Number(product.price);
    }
},
deleteFromCart: (state, action) => {
    const productId = action.payload;
    const removedItem = state.items.find(item => item.id === productId);
    if (removedItem) {
    state.items = state.items.filter(item => item.id !== productId);
    state.totalPrice -= Number(removedItem.price) * removedItem.quantity; 
    }
},
increaseQuantity: (state, action) => {
    const productId = action.payload;
    const item = state.items.find(item => item.id === productId);
    if (item) {
    item.quantity += 1;
    state.totalPrice += Number(item.price);
    }
},
decreaseQuantity: (state, action) => {
    const productId = action.payload;
    const item = state.items.find(item => item.id === productId);
    if (item && item.quantity > 1) {
    item.quantity -= 1;
    state.totalPrice -= Number(item.price);
    } else if (item && item.quantity === 1) {
    // Si la quantité est 1, supprimer complètement l'item
    state.items = state.items.filter(i => i.id !== productId);
    state.totalPrice -= Number(item.price);
    }
},
clearCart: (state) => {
    state.items = [];
    state.totalPrice = 0;
},
},
});

export const {createCartItem, deleteFromCart, increaseQuantity, decreaseQuantity, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
